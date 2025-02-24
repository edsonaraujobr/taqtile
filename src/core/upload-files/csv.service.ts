import { FileUpload } from "graphql-upload-ts";
import csv from "csv-parser";
import { Service } from "typedi";
import { InvalidCSVError } from "@domain/errors";

@Service()
export class CSVService {
  async validate(file: FileUpload): Promise<any[]> {

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
