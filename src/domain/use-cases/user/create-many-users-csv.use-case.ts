import { Service } from "typedi";
import path from "path";
import { FileUpload } from "graphql-upload-ts";
import { CSVService } from "@core/upload-files/csv.service";
import { FileExtensionError } from "@domain/errors";
import { CSVValidator } from "@domain/validators/csv.validator";
import {
  CreateAddressModel,
  CreateManyUsersModel,
  CreateUserModel,
} from "@domain/models";
import { UserDBDataSource } from "@data/user/user.db.datasource";
import { generateRandomPassword } from "@core/utils/generate-password.utils";
import { EmailService } from "@core/email/email.service";
import bcrypt from "bcryptjs";
import { SALT_ROUNDS } from "@core/utils/constants";
import { AddressDBDataSource } from "@data/address/address.db.datasource";
import dayjs from "dayjs";

@Service()
export class CreateManyUsersCSVUseCase {
  constructor(
    private readonly csvService: CSVService,
    private readonly csvValidator: CSVValidator,
    private readonly userDataSource: UserDBDataSource,
    private readonly addressDataSource: AddressDBDataSource,
    private readonly emailService: EmailService,
  ) {}

  async run({ file }: { file: FileUpload }): Promise<string> {
    const { filename } = file;
    const fileExtension = path.extname(filename).toLowerCase();

    if (fileExtension !== ".csv") {
      throw new FileExtensionError({
        message: "Extensão do arquivo inválido",
        additionalInfo: `A extensão ${fileExtension} não é permitida. Somente arquivos CSV são aceitos.`,
      });
    }

    const csvData = await this.csvService.validate(file);

    this.csvValidator.validate(csvData);

    const { createdUsers, skippedUsers } = await this.processUsers({
      users: csvData,
    });

    const message = `Foram cadastrados ${createdUsers.length} usuários.`;

    if (skippedUsers.length > 0) {
      return `${message} Os seguintes usuários foram ignorados por já estarem cadastrados: ${skippedUsers
        .map((user) => `Nome: ${user.name.trim()}, Email: ${user.email.trim()}`)
        .join("; ")}`;
    }

    return message;
  }

  private async processUsers({ users }: { users: CreateManyUsersModel[] }) {
    const createdUsers: CreateManyUsersModel[] = [];
    const skippedUsers: CreateManyUsersModel[] = [];

    const existingEmailsSet = new Set(
      await this.userDataSource.findAllEmails(),
    );

    const userPromises = users.map(async (user) => {
      if (existingEmailsSet.has(user.email)) {
        skippedUsers.push(user);
        return;
      }

      existingEmailsSet.add(user.email);

      const password = generateRandomPassword();
      const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

      const formattedBirthDate = dayjs(
        user.birthDate,
        "DD-MM-YYYY",
      ).toISOString();

      const newUser: CreateUserModel = {
        name: user.name,
        email: user.email,
        birthDate: formattedBirthDate,
        password: hashPassword,
      };

      const userCreated = await this.userDataSource.create({ data: newUser });

      const newAddress: CreateAddressModel = {
        userId: userCreated.id,
        cep: user.zipCode,
        city: user.city,
        state: user.state,
        neighborhood: user.neighborhood,
        street: user.street,
        streetNumber: Number(user.streetNumber),
        complement: user.complement,
      };

      const emailPromise = this.emailService.sendEmail({
        from: "no-reply@guina.com.br",
        to: user.email,
        subject: `Bem vindo, ${user.name}`,
        text: `A sua senha de acesso é: ${password}`,
      });

      await Promise.all([
        this.addressDataSource.create({ data: newAddress }),
        emailPromise,
      ]);

      createdUsers.push(user);
    });

    await Promise.all(userPromises);

    return { createdUsers, skippedUsers };
}
}
