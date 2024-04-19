export default function model(sequelize, DataTypes) {
  return sequelize.define('PERSONAL', {
    PERSONAL_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    CURRENT_FIRST_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CURRENT_LAST_NAME: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    CURRENT_MIDDLE_NAME: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    BIRTH_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    SOCIAL_SECURITY_NUMBER: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    DRIVERS_LICENSE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CURRENT_ADDRESS_1: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CURRENT_ADDRESS_2: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    CURRENT_CITY: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CURRENT_COUNTRY: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    CURRENT_ZIP: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    },
    CURRENT_GENDER: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    CURRENT_PHONE_NUMBER: {
      type: DataTypes.STRING(15),
      allowNull: true
    },
    CURRENT_PERSONAL_EMAIL: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    CURRENT_MARITAL_STATUS: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    ETHNICITY: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    SHAREHOLDER_STATUS: {
      type: DataTypes.SMALLINT,
      allowNull: true
    },
    BENEFIT_PLAN_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'BENEFIT_PLANS',
        key: 'BENEFIT_PLANS_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'PERSONAL',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_PERSONAL",
        unique: true,
        fields: [
          { name: "PERSONAL_ID" },
        ]
      },
    ]
  });
};
