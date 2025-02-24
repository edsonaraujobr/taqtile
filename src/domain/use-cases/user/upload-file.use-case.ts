import { Service } from "typedi";
import fs from "fs";
import path from "path";
import { FileUpload } from "graphql-upload-ts";
import { UploadDirectoryError } from "@domain/errors"
import { CSVService } from "@core/upload-files/csv.service";
import { EmptyCSVError, FileExtensionError } from "@domain/errors";
@Service()
export class UploadFileUseCase {
  constructor(private readonly csvService: CSVService) {}

  async run ({ file }: { file: FileUpload }): Promise<String> {

    const { filename } = file;
    const fileExtension = path.extname(filename).toLowerCase();

    if (fileExtension !== '.csv') {
      throw new FileExtensionError({
        message: "Extensão do arquivo inválido",
        additionalInfo: `A extensão ${fileExtension} não é permitida. Somente arquivos CSV são aceitos.`,
      });
    }

    const csvValidate = await this.csvService.validate(file);

    if (csvValidate.length === 0) {
      throw new EmptyCSVError({
        message: "O arquivo CSV está vazio ou inválido",
      });
    }

    const { createReadStream } = file;

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
