import { Service } from "typedi";
import fs from "fs";
import path from "path";
import { FileUpload } from "graphql-upload-ts";

@Service()
export class UploadFileUseCase {
  async run ({ file }: { file: FileUpload }): Promise<String> {

    const { createReadStream, filename } = file;

    const filePath = path.join(__dirname, "../../uploads", filename);
    const stream = createReadStream();
    const out = fs.createWriteStream(filePath);

    stream.pipe(out);

    return `Arquivo ${filename} enviado com sucesso!`
  }
}
