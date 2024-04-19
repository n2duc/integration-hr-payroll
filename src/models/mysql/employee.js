import { Sequelize } from "sequelize"
export default function model(sequelize, DataTypes) {
  return sequelize.define('employee', {
    idEmployee: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    employeeNumber: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    lastName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    SSN: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    payRate: {
      type: DataTypes.STRING(40),
      allowNull: true
    },
    payRates_idPayRates: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'payrates',
        key: 'idPayRates'
      }
    },
    vacationDays: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    paidToDate: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: true
    },
    paidLastYear: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'employee',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "employeeNumber" },
          { name: "payRates_idPayRates" },
        ]
      },
      {
        name: "Employee Number_UNIQUE",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "employeeNumber" },
        ]
      },
      {
        name: "fk_Employee_Pay Rates_idx",
        using: "BTREE",
        fields: [
          { name: "payRates_idPayRates" },
        ]
      },
    ]
  });
};
