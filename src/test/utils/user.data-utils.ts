export const userData = {
  validUser: {
    name: "Edson Araújo",
    email: "edson@gmail.com",
    password: "edson1010",
    birthDate: "10-10-2000",
  },
  validUserWithoutBirthDate: {
    name: "Edson Araújo",
    email: "edsom@gmail.com",
    password: "edson1010",
  },
  duplicateEmailUser: {
    name: "Cristiano Ronaldo",
    email: "edson@gmail.com",
    password: "randowmpassword123",
  },
  weakPasswordUser: {
    name: "Cristiano Ronaldo",
    email: "edson@gmail.com",
    password: "123",
  },
  futureBirthDateUser: {
    name: "Edson Araújo",
    email: "edson@gmail.com",
    password: "edson1010",
    birthDate: "10-10-2025",
  },
  invalidBirthDateUser: {
    name: "Edson Araújo",
    email: "edson@gmail.com",
    password: "edson1010",
    birthDate: "1",
  },
  maxAgeExceededUser: {
    name: "Edson Araújo",
    email: "edsoasasan@gmail.com",
    password: "edson1010",
    birthDate: "10-10-1800",
  },
};
