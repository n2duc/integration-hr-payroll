export default function model(sequelize, DataTypes) {
  return sequelize.define('EMPLOYMENT_WORKING_TIME', {
    EMPLOYMENT_WORKING_TIME_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    EMPLOYMENT_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'EMPLOYMENT',
        key: 'EMPLOYMENT_ID'
      }
    },
    YEAR_WORKING: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    MONTH_WORKING: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: true
    },
    NUMBER_DAYS_ACTUAL_OF_WORKING_PER_MONTH: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: true
    },
    TOTAL_NUMBER_VACATION_WORKING_DAYS_PER_MONTH: {
      type: DataTypes.DECIMAL(2,0),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'EMPLOYMENT_WORKING_TIME',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_EMPLOYMENT_WORKING_TIME",
        unique: true,
        fields: [
          { name: "EMPLOYMENT_WORKING_TIME_ID" },
        ]
      },
    ]
  });
};
