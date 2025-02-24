import { Model, DataTypes } from 'sequelize';
import sequelize from '../config/database'; // Adjust the path as necessary

class Website extends Model {
    public id!: number;
    public name!: string;
}

Website.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'Website',
        tableName: 'websites',
        timestamps: true, // Set to true if you want createdAt and updatedAt fields
    }
);

// Sync the model with the database
(async () => {
    await Website.sync(); // This will create the table if it doesn't exist
    // Check for existing records
    const existingWebsites = await Website.findAll();
    if (existingWebsites.length === 0) {
        // Insert pre-defined data
        await Website.bulkCreate([
            { name: 'blinkit' },
            { name: 'zepto' },
        ]);
    }
})();

export default Website;