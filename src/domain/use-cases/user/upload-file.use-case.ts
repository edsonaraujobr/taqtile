import { Service } from "typedi";
import fs from "fs";
import path from "path";
import { FileUpload } from "graphql-upload-ts";
import { UploadDirectoryError } from "@domain/errors"
import { CSVService } from "@core/upload-files/csv.service";
import { InvalidCSVError, EmptyCSVError, FileExtensionError } from "@domain/errors";
@Service()
export class UploadFileUseCase {
  constructor(private readonly csvService: CSVService) {}

  async run ({ file }: { file: FileUpload }): Promise<String> {

    try {
      const csvValidate = await this.csvService.validate(file);

      if (csvValidate.length === 0) {
        throw new EmptyCSVError({
          message: "O arquivo CSV está vazio ou inválido",
        });
      }
    } catch (error) {
      if(error instanceof FileExtensionError ) {
        throw error;
      }
      throw new InvalidCSVError({
        message: "Erro na validação do CSV",
        additionalInfo: error.message,
      });
    }

    const { createReadStream, filename } = file;

    const uploadDir = path.resolve(__dirname, "../../../..", "src/data/uploads");

    try {
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
    } catch (error) {
      throw new UploadDirectoryError({
        message: "Erro ao criar diretório de uploads",
        additionalInfo: error,
      });
    }

    const filePath = path.join(uploadDir, filename);
    const stream = createReadStream();
    const out = fs.createWriteStream(filePath);
    stream.pipe(out);

    return `Arquivo ${filename} enviado com sucesso!`;
  }
}
