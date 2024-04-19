export default function model(sequelize, DataTypes) {
  return sequelize.define('EMPLOYMENT', {
    EMPLOYMENT_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: false,
      primaryKey: true
    },
    EMPLOYMENT_CODE: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    EMPLOYMENT_STATUS: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    HIRE_DATE_FOR_WORKING: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    WORKERS_COMP_CODE: {
      type: DataTypes.CHAR(10),
      allowNull: true
    },
    TERMINATION_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    REHIRE_DATE_FOR_WORKING: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    LAST_REVIEW_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    NUMBER_DAYS_REQUIREMENT_OF_WORKING_PER_MONTH: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true
    },
    PERSONAL_ID: {
      type: DataTypes.DECIMAL(18,0),
      allowNull: true,
      references: {
        model: 'PERSONAL',
        key: 'PERSONAL_ID'
      }
    }
  }, {
    sequelize,
    tableName: 'EMPLOYMENT',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_EMPLOYMENT",
        unique: true,
        fields: [
          { name: "EMPLOYMENT_ID" },
        ]
      },
    ]
  });
};
