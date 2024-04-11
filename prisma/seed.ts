import {
  Branch,
  Car,
  User,
  UserRole,
  CarType,
  CarColour,
} from "@prisma/client";
import { prisma } from "../src/lib/db/client.ts";
import { parseArgs } from "node:util";

///// TEST / PREVIEW SEED /////

async function testSeed() {
  const testface = await prisma.user.upsert({
    where: { email: "testface@prisma.io" },
    update: {},
    create: {
      email: "testface@prisma.io",
      name: "John Testface",
      comment: "This customer is part of the seed data.",
      role: UserRole.CUSTOMER,
      // SuperSecurePassword!
      passwordHash:
        "$2b$12$16VZC7zWzO1VYW.hENoWgusJLoQ9FDL/1jtzQ5J/SHFU2Rn.CDxTK",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@prisma.io" },
    update: {},
    create: {
      email: "admin@prisma.io",
      name: "Mike Admin",
      comment: "This administrator is part of the seed data.",
      role: UserRole.ADMIN,
      // HarnessAdminPower8
      passwordHash:
        "$2b$12$ZkfLh4nwP1lEPHFubTZXHOmK4J4S6gz9VkoLpgZsUjuA/YdabZpKm",
    },
  });

  await prisma.user.upsert({
    where: { email: "rep@prisma.io" },
    update: {},
    create: {
      email: "rep@prisma.io",
      name: "Shelly Representative",
      comment: "This representative is part of the seed data.",
      role: UserRole.REP,
      // ThisJobIsExhausting
      passwordHash:
        "$2b$12$u6T4DfeJTfLztnxfHUKvc.ehlVfRJmOeGa6.9tuCX15WYjKdJyw3q",
    },
  });

  const yulAirport = await prisma.branch.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Montréal-Trudeau International Airport",
      description:
        "Conveniently grab a car after your flight into Montréal. Enjoy the smooth, well-maintained roads that Québec has to offer.",
      streetAddress: "975 boul. Roméo-Vachon N",
      city: "Dorval",
      region: "QC",
      country: "CA",
      postalCode: "H4Y 1H1",
      iataAirportCode: "YUL",
      latitude: 45.4656587641663,
      longitude: -73.74548542331343,
      timezone: "America/Toronto",
    },
  });

  const redFerrari = await prisma.car.upsert({
    where: { id: 1 },
    update: {},
    create: {
      branchId: yulAirport.id,
      photoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/0/00/2021_Ferrari_F8_Tributo.jpg",
      make: "Ferrari",
      carsize: CarType.Supercar,
      model: "F8 Tributo",
      year: 2020,
      colour: CarColour.RED,
      seats: 2,
      description:
        "Enjoy the icon of luxury in this red Ferrari. May come with an increased risk of traffic tickets.",
      dailyPrice: 129900,
    },
  });

  const practicalSUV = await prisma.car.upsert({
    where: { id: 2 },
    update: {},
    create: {
      branchId: yulAirport.id,
      make: "Toyota",
      carsize: CarType.SUV,
      model: "Highlander",
      year: 2021,
      photoUrl:
        "https://toyotacanada.scene7.com/is/image/toyotacanada/Highlander_XSE?ts=1688689328971&$Media-Large$&dpr=off",
      colour: CarColour.BLACK,
      seats: 7,
      description:
        "Perfect for road trips with the whole family, this SUV seats 7 passengers and has all-wheel drive.",
      dailyPrice: 8900,
    },
  });

  await prisma.like.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: 1,
      carId: 1,
    },
  });

  // Prepaid gas accessory
  await prisma.accessory.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: "Prepaid Gas Refill",
      description:
        "Skip the hassle of looking for a station on your way back - we'll fill up the tank for you!",
      price: 10000,
    },
  });

  const originalReservation = await prisma.reservation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      carId: redFerrari.id,
      holderId: testface.id,
      quotedPrice: 389700,
      creditCardNumber: "4242424242424242",
      creditCardExpiry: "0526",
      creditCardCVV: "123",
      plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
      plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
    },
  });

  // Changed your mind on such an expensive car, same dates
  await prisma.reservation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      carId: practicalSUV.id,
      holderId: testface.id,
      replacesId: originalReservation.id,
      quotedPrice: 26700,
      creditCardNumber: "4242424242424242",
      creditCardExpiry: "0526",
      creditCardCVV: "123",
      plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
      plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
    },
  });

  // Cancelled past reservation
  await prisma.reservation.upsert({
    where: { id: 3 },
    update: {},
    create: {
      carId: redFerrari.id,
      holderId: testface.id,
      quotedPrice: 129900,
      cancelled: true,
      creditCardNumber: "5555555555554444",
      creditCardExpiry: "0224", // now expired
      creditCardCVV: "456",
      plannedDepartureAt: new Date("2024-01-04T09:00:00.000-05:00"),
      plannedReturnAt: new Date("2024-01-04T19:00:00.000-05:00"),
    },
  });

  // Unchanged future reservation
  await prisma.reservation.upsert({
    where: { id: 4 },
    update: {},
    create: {
      carId: practicalSUV.id,
      holderId: testface.id,
      quotedPrice: 17800,
      creditCardNumber: "378282246310005", // amex length 15
      creditCardExpiry: "1024",
      creditCardCVV: "9876", // amex length 4
      plannedDepartureAt: new Date("2024-07-04T08:00:00.000-04:00"),
      plannedReturnAt: new Date("2024-07-05T18:00:00.000-04:00"),
    },
  });

  for (let i = 5; i <= 10; i++) {
    await prisma.reservation.upsert({
      where: { id: i },
      create: {
        carId: redFerrari.id,
        holderId: testface.id,
        quotedPrice: 10000 * i,
        creditCardNumber: "5105105105105100",
        creditCardExpiry: "0130",
        creditCardCVV: "000",
        plannedDepartureAt: new Date("2024-05-01T09:00:00.000-04:00"),
        plannedReturnAt: new Date("2024-05-03T19:00:00.000-04:00"),
      },
      update: {},
    });
  }

  await prisma.reservation.upsert({
    where: { id: 11 },
    create: {
      carId: redFerrari.id,
      holderId: testface.id,
      quotedPrice: 100000,
      creditCardNumber: "4111111111111111",
      creditCardExpiry: "1224",
      creditCardCVV: "666",
      plannedDepartureAt: new Date("2024-03-01T09:00:00.000-04:00"),
      pickedUpAt: new Date("2024-03-01T09:30:00.000-04:00"),
      plannedReturnAt: new Date("2024-03-03T19:00:00.000-04:00"),
      returnedAt: new Date("2024-03-03T18:53:00.000-04:00"),
    },
    update: {},
  });

  await prisma.coupon.upsert({
    where: { couponCode: "SAVENOW10" },
    update: {},
    create: {
      couponCode: "SAVENOW10",
      discountBasisPoints: 1000, // 10% discount
    },
  });

  await prisma.coupon.upsert({
    where: { couponCode: "HALFOFF" },
    update: {},
    create: {
      couponCode: "HALFOFF",
      discountBasisPoints: 5000, // 50% discount
    },
  });

  await prisma.coupon.upsert({
    where: { couponCode: "THIRTYOFF" },
    update: {},
    create: {
      couponCode: "THIRTYOFF",
      discountBasisPoints: 3000, // 30% discount
    },
  });

  // No seeds for reservations with accessories yet because that's not a sprint 1 feature.
}

///// PRODUCTION AND DEVELOP SEED /////

async function seedBranches(): Promise<Branch[]> {
  const branches: Branch[] = [];

  branches.push(
    await prisma.branch.upsert({
      where: { id: 1 },
      update: {},
      create: {
        name: "Montréal-Trudeau International Airport",
        description:
          "Conveniently grab a car after your flight into Montréal. Enjoy the smooth, well-maintained roads that Québec has to offer.",
        streetAddress: "975 boul. Roméo-Vachon N",
        city: "Dorval",
        region: "QC",
        country: "CA",
        postalCode: "H4Y 1H1",
        iataAirportCode: "YUL",
        latitude: 45.4656587641663,
        longitude: -73.74548542331343,
        timezone: "America/Toronto",
      },
    }),
  );

  return branches;
}

async function seedUsers(): Promise<User[]> {
  const users: User[] = [];

  users.push(
    await prisma.user.upsert({
      where: { email: "admin@prisma.io" },
      update: {},
      create: {
        email: "admin@prisma.io",
        name: "Admin Man",
        comment: "Main ADMIN account.",
        role: UserRole.ADMIN,
        // SuperSecurePassword!   //TODO: We can make this a secret
        passwordHash:
          "$2b$12$16VZC7zWzO1VYW.hENoWgusJLoQ9FDL/1jtzQ5J/SHFU2Rn.CDxTK",
      },
    }),
  );

  users.push(
    await prisma.user.upsert({
      where: { email: "testface@prisma.io" },
      update: {},
      create: {
        email: "testface@prisma.io",
        name: "John Testface",
        comment: "This customer is part of the seed data.",
        role: UserRole.CUSTOMER,
        // SuperSecurePassword!
        passwordHash:
          "$2b$12$16VZC7zWzO1VYW.hENoWgusJLoQ9FDL/1jtzQ5J/SHFU2Rn.CDxTK",
      },
    }),
  );

  users.push(
    await prisma.user.upsert({
      where: { email: "rep@prisma.io" },
      update: {},
      create: {
        email: "rep@prisma.io",
        name: "Shelly Representative",
        comment: "This representative is part of the seed data.",
        role: UserRole.REP,
        // ThisJobIsExhausting
        passwordHash:
          "$2b$12$u6T4DfeJTfLztnxfHUKvc.ehlVfRJmOeGa6.9tuCX15WYjKdJyw3q",
      },
    }),
  );

  return users;
}

async function seedCars(branches: Branch[]): Promise<Car[]> {
  const cars: Car[] = [];

  cars.push(
    await prisma.car.upsert({
      where: { id: 1 },
      update: {},
      create: {
        branchId: branches[0].id,
        photoUrl:
          "https://d2uaf6imk63abi.cloudfront.net/c48f3306-f294-4837-8d95-f3b2381b03be-2021_Ferrari_F8_Tributo.jpg",
        make: "Ferrari",
        carsize: CarType.Supercar,
        model: "F8 Tributo",
        year: 2020,
        colour: CarColour.RED,
        seats: 2,
        description:
          "Enjoy the icon of luxury in this red Ferrari. May come with an increased risk of traffic tickets.",
        dailyPrice: 129900,
      },
    }),
  );

  cars.push(
    await prisma.car.upsert({
      where: { id: 2 },
      update: {},
      create: {
        branchId: branches[0].id,
        make: "Toyota",
        carsize: CarType.SUV,
        model: "Highlander",
        year: 2021,
        photoUrl:
          "https://d2uaf6imk63abi.cloudfront.net/f780562b-7e31-46b9-8533-5302e7584a49-Toyota_Highlander_Hybrid_XU70_1X7A6356.jpg",
        colour: CarColour.BLACK,
        seats: 7,
        description:
          "Perfect for road trips with the whole family, this SUV seats 7 passengers and has all-wheel drive.",
        dailyPrice: 8900,
      },
    }),
  );

  return cars;
}

async function seedReservations(users: User[], cars: Car[]) {
  const now = new Date();

  const originalReservation = await prisma.reservation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      carId: cars[0].id,
      holderId: users.find((u) => u.role === UserRole.CUSTOMER)?.id ?? 1,
      quotedPrice: 519600,
      creditCardNumber: "4242424242424242",
      creditCardExpiry: "0526",
      creditCardCVV: "123",
      plannedDepartureAt: new Date(now.getDate() + 2),
      plannedReturnAt: new Date(now.getDate() + 6),
    },
  });

  await prisma.reservation.upsert({
    where: { id: 1 },
    update: {},
    create: {
      carId: cars[0].id,
      holderId: users.find((u) => u.role === UserRole.CUSTOMER)?.id ?? 1,
      quotedPrice: 519600,
      replacesId: originalReservation.id,
      creditCardNumber: "4242424242424242",
      creditCardExpiry: "0526",
      creditCardCVV: "123",
      plannedDepartureAt: new Date(now.getDate()),
      plannedReturnAt: new Date(now.getDate() + 4),
    },
  });

  await prisma.reservation.upsert({
    where: { id: 2 },
    update: {},
    create: {
      carId: cars[1].id,
      holderId: users.find((u) => u.role === UserRole.CUSTOMER)?.id ?? 1,
      quotedPrice: 71200,
      creditCardNumber: "4242424242424242",
      creditCardExpiry: "0526",
      creditCardCVV: "123",
      plannedDepartureAt: new Date(now.getDate() + 1),
      plannedReturnAt: new Date(now.getDate() + 9),
    },
  });
}

async function seedCoupons() {
  await prisma.coupon.upsert({
    where: { couponCode: "SAVENOW10" },
    update: {},
    create: {
      couponCode: "SAVENOW10",
      discountBasisPoints: 1000, // 10% discount
    },
  });

  await prisma.coupon.upsert({
    where: { couponCode: "HALFOFF" },
    update: {},
    create: {
      couponCode: "HALFOFF",
      discountBasisPoints: 5000, // 50% discount
    },
  });

  await prisma.coupon.upsert({
    where: { couponCode: "THIRTYOFF" },
    update: {},
    create: {
      couponCode: "THIRTYOFF",
      discountBasisPoints: 3000, // 30% discount
    },
  });
}

async function seedLikes(cars: Car[], Users: User[]) {
  await prisma.like.upsert({
    where: { id: 1 },
    update: {},
    create: {
      userId: Users[0].id,
      carId: cars[0].id,
    },
  });

  await prisma.like.upsert({
    where: { id: 2 },
    update: {},
    create: {
      userId: Users[1].id,
      carId: cars[0].id,
    },
  });

  await prisma.like.upsert({
    where: { id: 3 },
    update: {},
    create: {
      userId: Users[2].id,
      carId: cars[0].id,
    },
  });
}

async function seedMain() {
  const users = await seedUsers();
  const branches = await seedBranches();
  const cars = await seedCars(branches);
  await seedReservations(users, cars);
  await seedLikes(cars, users);
  await seedCoupons();
}

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options: { environment: { type: "string" } } });

  if (environment) {
    console.log(`Seeding database for environment: ${environment}`);
  } else {
    console.log("No environment specified, seeding test data.");
  }

  switch (environment) {
    case "production":
    case "develop":
      await seedMain();
      break;
    case "preview":
    default:
      await testSeed();
      break;
  }
}

main();
