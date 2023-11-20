import { app } from "../src/app";
import supertest from "supertest";
import httpStatus from "http-status";
import { createFruit } from "./factory/fruits.factory";
import fruits from "../src/data/fruits";

const api = supertest(app);

beforeEach(() => {
  fruits.length === 0;
});

describe("POST /fruits", () => {
  it("should return 201 when inserting a fruit", async () => {
    const body = createFruit();
    const { status } = await api.post("/fruits").send(body);
    expect(status).toBe(httpStatus.CREATED);
  });

  it("should return 409 when inserting a fruit that is already registered", async () => {
    await api.post("/fruits").send(createFruit("Lemon"));
    const { status } = await api.post("/fruits").send(createFruit("Lemon"));
    expect(status).toBe(httpStatus.CONFLICT);
  });

  it("should return 422 when inserting a fruit with data missing", async () => {
    const { status } = await api.post("/fruits").send({});
    expect(status).toBe(httpStatus.UNPROCESSABLE_ENTITY);
  });
});

describe("GET /fruits", () => {
  it("shoud return 404 when trying to get a fruit by an id that doesn't exist", async () => {
    const { status } = await api.get("/fruits/6001");
    expect(status).toBe(httpStatus.NOT_FOUND);
  });

  it("should return 400 when id param is present but not valid", async () => {
    const { status } = await api.get("/fruits/batata");
    expect(status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should return one fruit when given a valid and existing id", async () => {
    const fruit = createFruit();
    const response = await api.post(`/fruits`).send(fruit);
    const { status, body } = await api.get(`/fruits/1`);
    expect(status).toBe(httpStatus.OK);
    expect(body.name).toBe(fruit.name);
  });

  it("should return all fruits if no id is present", async () => {});
});
