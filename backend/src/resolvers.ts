import Art from "./models/Art";

const resolvers = {
  Query: {
    // Get all artworks
    arts: async () => {
      try {
        return await Art.findAll({
          order: [["createdAt", "DESC"]],
        });
      } catch (error) {
        console.error("Error fetching arts:", error);
        throw new Error("Failed to fetch artworks");
      }
    },

    // Get a single artwork by ID
    art: async (_: any, { id }: { id: string }) => {
      try {
        const art = await Art.findByPk(id);
        if (!art) {
          throw new Error(`Artwork with ID ${id} not found`);
        }
        return art;
      } catch (error) {
        console.error(`Error fetching art with ID ${id}:`, error);
        throw new Error("Failed to fetch artwork");
      }
    },
  },

  Mutation: {
    // Save a new artwork
    saveArt: async (
      _: any,
      {
        data,
        title,
        palette,
        complexity,
      }: {
        data: string;
        title?: string;
        palette?: string;
        complexity?: number;
      }
    ) => {
      try {
        // Validate input
        if (!data) {
          throw new Error("Artwork data is required");
        }

        // Create new artwork record
        const art = await Art.create({
          data,
          title: title || `Artwork-${Date.now()}`,
          palette,
          complexity,
        });

        return art;
      } catch (error) {
        console.error("Error saving art:", error);
        throw new Error("Failed to save artwork");
      }
    },

    // Delete an artwork
    deleteArt: async (_: any, { id }: { id: string }) => {
      try {
        const art = await Art.findByPk(id);
        if (!art) {
          throw new Error(`Artwork with ID ${id} not found`);
        }

        await art.destroy();
        return { id, success: true };
      } catch (error) {
        console.error(`Error deleting art with ID ${id}:`, error);
        throw new Error("Failed to delete artwork");
      }
    },
  },
};

export default resolvers;
