import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('little_lemon.db');

export const createTables = () => {
    db.transaction(tx => {
        tx.executeSql('CREATE TABLE IF NOT EXISTS menu (id INTEGER PRIMARY KEY, name TEXT, description TEXT, price REAL, image TEXT, category TEXT);');
    });
};

export const saveMenuItems = (items) => {
    db.transaction(tx => {
        items.forEach(item => {
            tx.executeSql('INSERT OR REPLACE INTO menu (name, description, price, image, category) VALUES (?, ?, ?, ?, ?);', [item.name, item.description, item.price, item.image, item.category]);
        });
    }, null, null);
};

export const getMenuItemsByCategories = (categories, callback) => {
    let placeholders = categories.map(() => '?').join(', ');
    db.transaction(tx => {
        tx.executeSql(`SELECT * FROM menu WHERE category IN (${placeholders});`, categories, (_, { rows: { _array } }) => {
            callback(_array);
        });
    });
};

export const getFilteredMenuItems = (categories, query, callback) => {
    let placeholders = categories.map(() => '?').join(', ');
    let sql = `SELECT * FROM menu WHERE name LIKE ?`;
    if (categories.length > 0) {
        sql += ` AND category IN (${placeholders})`;
    }

    db.transaction(tx => {
        tx.executeSql(sql, [`%${query}%`, ...categories], (_, { rows: { _array } }) => {
            callback(_array);
        });
    });
};

