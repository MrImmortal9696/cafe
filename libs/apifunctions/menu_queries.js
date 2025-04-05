export const InsertQueryHandling = [
  {
    mode: "insert",
    item_type: "menu_items",
    table_name: "MenuItems",
    query: (data) => `
      INSERT INTO MenuItems (CategoryID, ItemName, Description, Price, Options, ImageURL, IsAvailable, SpiceLevel)
      VALUES (?, ?, ?, ?, ${
        data.Options && data.Options.length > 0
          ? `JSON_ARRAY(${data.Options
              .map(() => `JSON_OBJECT('name', ?, 'price', ?)`)
              .join(",")})`
          : "NULL"
      }, ?, ?, ?)
    `,
    values: (data) => {
      const optionValues = [];
      if (data.Options && data.Options.length > 0) {
        data.Options.forEach((option) => {
          if (option.name !== undefined && option.price !== undefined) {
            optionValues.push(option.name, option.price);
          }
        });
      }
      console.log({"optionValues":optionValues})


      return [
        data.CategoryID, // Corresponds to CategoryID
        data.ItemName, // Corresponds to ItemName
        data.Description, // Corresponds to Description
        data.Price === "-" ? null : parseFloat(data.Price), // Null if price is "-"
        ...optionValues, // Add dynamic option values
        data.ImageURL || null, // Null if no ImageURL is provided
        !!data.IsAvailable || 0, // Convert IsAvailable to a boolean
        data.SpiceLevel || null,
      ];
    },
  },
    {
      mode: "insert",
      item_type: "menu_categories",
      table_name: "MenuCategories",
      query: (data) => `
        INSERT INTO MenuCategories (CategoryName, MenuTypeID)
        VALUES (?,?)`,
      values: (data) => [
        data.CategoryName, // Corresponds to ?
        data.MenuTypeID,   // Corresponds to ?
    ],
    },
    {
      mode: "insert",
      item_type: "menu_type",
      table_name: "MenuTypes",
      query: (data) => `
        INSERT INTO MenuTypes (MenuTypeName) VALUES (?)`,
      values: (data) => [
        data.MenuTypeName,
    ]
    }
  ];
  
export const UpdateQueryHandling = [
  {
    mode:"update",
    item_type:"menu_items",
    table_name:"MenuItems",
    query: (data) => `
    UPDATE MenuItems
      SET 
        CategoryID = ?,
        ItemName = ?,
        Description = ?,
        Price = ?,
        Options = ?,
        ImageURL = ?,
        IsAvailable = ?,
        SpiceLevel = ?
      WHERE ItemID = ?`,
  
      values: (data) => [
        data.CategoryID,
        data.ItemName,
        data.Description || null,
        data.Price === '-' ? null : parseFloat(data.Price),
        // Pass Options as a JSON string
        data.Options && data.Options.length > 0 ? JSON.stringify(data.Options) : null, 
        data.ImageURL || null,
        data.IsAvailable || 0,
        data.SpiceLevel || 0,
        data.ItemID
      ]
      
    
  },
  {
    mode:"update",
    item_type:"menu_categories",
    table_name:"MenuCategories",
    query: (data)=>`
    UPDATE MenuCategories 
    SET 
      CategoryName = ?,
      MenuTypeID = ?
      WHERE CategoryID = ?`,
    values:(data)=>[
      data.CategoryName,
      data.MenuTypeID,
      data.CategoryID,
    ]
  },
  {
    mode:"update",
    item_type:"menu_type",
    table_name:"MenuTypes",
    query:(data)=>
      `UPDATE MenuTypes
        SET MenuTypeName = ?
        WHERE MenuTypeID = ?`,
    values:(data) => [
      data.MenuTypeName,
      data.MenuTypeID,
    ]
  }
]
export const DeleteQueryHandling = [
  {
    mode: "delete",
    item_type: "menu_items",
    table_name: "MenuItems",
    query: (data) => `
      DELETE FROM MenuItems
      WHERE ItemID = ?`,
    values: (data) => [
      data.ItemID, // Identifies the specific menu item to delete
    ],
  },
  {
    mode: "delete",
    item_type: "menu_categories",
    table_name: "MenuCategories",
    query: (data) => `
      DELETE FROM MenuCategories
      WHERE CategoryID = ?`, 
    values: (data) => [
      data.CategoryID, // Identifies the specific category to delete
    ],
  },
  {
    mode: "delete",
    item_type: "menu_type",
    table_name: "MenuTypes",
    query: (data) => `
      DELETE FROM MenuTypes
      WHERE MenuTypeID = ?`, 
    values: (data) => [
      data.MenuTypeID, // Identifies the specific menu type to delete
    ],
  },
];
