import { Sequelize } from "sequelize";
export default function model(sequelize, DataTypes) {
  return sequelize.define('payrates', {
    idPayRates: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    payRateName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    Value: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    taxPercentage: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    payType: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payAmount: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    },
    PTLevelC: {
      type: DataTypes.DECIMAL(10,0),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'payrates',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "idPayRates" },
        ]
      },
    ]
  });
};
