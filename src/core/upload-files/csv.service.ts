import { FileUpload } from "graphql-upload-ts";
import csv from "csv-parser";
import { Service } from "typedi";
import { InvalidCSVError } from "@domain/errors";
import path from "path";
import { FileExtensionError } from "@domain/errors/file-extension.error";

@Service()
export class CSVService {
  async validate(file: FileUpload): Promise<any[]> {
    const { filename } = file;
    const fileExtension = path.extname(filename).toLowerCase();

    if (fileExtension !== '.csv') {
      throw new FileExtensionError({
        message: "Formato de arquivo inválido",
        additionalInfo: `A extensão ${fileExtension} não é permitida. Somente arquivos CSV são aceitos.`,
      });
    }

    const fileStream = file.createReadStream();
    const rows: any[] = [];

    return new Promise((resolve, reject) => {
      fileStream
        .pipe(csv())
        .on("error", (error) => {
          reject(
            new InvalidCSVError({
              message: "Formato de arquivo inválido",
              additionalInfo: error.message,
            })
          );
        })
        .on("data", (data) => {
          rows.push(data);
        })
        .on("end", () => {
          resolve(rows);
        });
    });
  }
}
