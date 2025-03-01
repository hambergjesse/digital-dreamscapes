import { expect } from "chai";
import sinon from "sinon";
import resolvers from "../src/resolvers";
import Art from "../src/models/Art";

describe("GraphQL Resolvers", () => {
  let findAllStub: sinon.SinonStub;
  let findByPkStub: sinon.SinonStub;
  let createStub: sinon.SinonStub;
  let destroyStub: sinon.SinonStub;

  beforeEach(() => {
    // Create stubs for database operations
    findAllStub = sinon.stub(Art, "findAll");
    findByPkStub = sinon.stub(Art, "findByPk");
    createStub = sinon.stub(Art, "create");
    destroyStub = sinon.stub(Art.prototype, "destroy");
  });

  afterEach(() => {
    // Restore all stubs
    sinon.restore();
  });

  describe("Query", () => {
    describe("arts", () => {
      it("should return all arts", async () => {
        // Mock data for Arts
        const mockArts = [
          { id: 1, data: "art1", title: "Title 1", createdAt: new Date() },
          { id: 2, data: "art2", title: "Title 2", createdAt: new Date() },
        ];

        // Setup the stub to return mock data
        findAllStub.resolves(mockArts);

        // Call the resolver
        const result = await resolvers.Query.arts();

        // Assertions
        expect(findAllStub.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockArts);
      });

      it("should handle errors", async () => {
        // Setup the stub to throw an error
        findAllStub.rejects(new Error("Database error"));

        try {
          await resolvers.Query.arts();
          // If no error is thrown, fail the test
          expect.fail("Expected an error but none was thrown");
        } catch (error) {
          expect(error.message).to.equal("Failed to fetch artworks");
        }
      });
    });
  });

  describe("Mutation", () => {
    describe("saveArt", () => {
      it("should create a new art", async () => {
        // Mock data
        const artData = "data:image/png;base64,test";
        const title = "Test Art";
        const palette = "Ocean Breeze";
        const complexity = 15;

        const mockArt = {
          id: 1,
          data: artData,
          title,
          palette,
          complexity,
          createdAt: new Date(),
        };

        // Setup the stub
        createStub.resolves(mockArt);

        // Call the resolver
        const result = await resolvers.Mutation.saveArt(null, {
          data: artData,
          title,
          palette,
          complexity,
        });

        // Assertions
        expect(createStub.calledOnce).to.be.true;
        expect(result).to.deep.equal(mockArt);
      });

      it("should throw an error if data is missing", async () => {
        try {
          await resolvers.Mutation.saveArt(null, { data: "" });
          expect.fail("Expected an error but none was thrown");
        } catch (error) {
          expect(error.message).to.equal("Artwork data is required");
        }
      });
    });
  });
});
