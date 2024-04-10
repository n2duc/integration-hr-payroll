import { DataTypes } from 'sequelize';

export default function model(sequelize) {
  const attributes = {
    Employee_ID: {
      type: DataTypes.DECIMAL(18, 0),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    First_Name: {
      type: DataTypes.STRING(50),
    },
    Last_Name: {
      type: DataTypes.STRING(50),
    },
    Middle_Initial: {
      type: DataTypes.STRING(50),
    },
    Address_1: {
      type: DataTypes.STRING(50),
    },
    Address_2: {
      type: DataTypes.STRING(50),
    },
    City: {
      type: DataTypes.STRING(50),
    },
    State: {
      type: DataTypes.STRING(50),
    },
    Zip: {
      type: DataTypes.DECIMAL(18, 0),
    },
    Email: {
      type: DataTypes.STRING(50),
    },
    Phone_Number: {
      type: DataTypes.STRING(50),
    },
    Social_Security_Number: {
      type: DataTypes.STRING(50),
    },
    Drivers_License: {
      type: DataTypes.STRING(50),
    },
    Marital_Status: {
      type: DataTypes.STRING(50),
    },
    Gender: {
      type: DataTypes.BOOLEAN,
    },
    Shareholder_Status: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    Benefit_Plans: {
      type: DataTypes.DECIMAL(18, 0),
    },
    Ethnicity: {
      type: DataTypes.STRING(50),
    },
  };

  const options = {
    freezeTableName: true,
    timestamps: false,
  };

  return sequelize.define('PersonalTest', attributes, options);
}