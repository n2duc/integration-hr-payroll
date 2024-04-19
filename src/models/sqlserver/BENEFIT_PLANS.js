export default function model(sequelize, DataTypes) {
  return sequelize.define('BENEFIT_PLANS', {
    BENEFIT_PLANS_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    PLAN_NAME: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    DEDUCTABLE: {
      type: DataTypes.DECIMAL(19,4),
      allowNull: true
    },
    PERCENTAGE_COPAY: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'BENEFIT_PLANS',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_BENEFIT_PLANS",
        unique: true,
        fields: [
          { name: "BENEFIT_PLANS_ID" },
        ]
      },
    ]
  });
};
