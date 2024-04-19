export default function model(sequelize, DataTypes) {
  return sequelize.define('JOB_HISTORY', {
    JOB_HISTORY_ID: {
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
    DEPARTMENT: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    DIVISION: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    FROM_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    THRU_DATE: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    JOB_TITLE: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    SUPERVISOR: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    LOCATION: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    TYPE_OF_WORK: {
      type: DataTypes.SMALLINT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'JOB_HISTORY',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_JOB_HISTORY",
        unique: true,
        fields: [
          { name: "JOB_HISTORY_ID" },
        ]
      },
    ]
  });
};
