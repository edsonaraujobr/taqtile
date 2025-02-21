import { Service } from "typedi";
import fs from "fs";
import path from "path";
import { FileUpload } from "graphql-upload-ts";
import { UploadDirectoryError } from "@domain/errors"

@Service()
export class UploadFileUseCase {
  async run ({ file }: { file: FileUpload }): Promise<String> {

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
