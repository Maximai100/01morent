// Скрипт для получения схемы коллекций из Directus
// Запустите: node get_directus_schema.js

const DIRECTUS_URL = 'http://localhost:8055'; // Замените на ваш URL
const DIRECTUS_TOKEN = 'your_token_here'; // Замените на ваш токен

async function getDirectusSchema() {
  try {
    const response = await fetch(`${DIRECTUS_URL}/collections`, {
      headers: {
        'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const collections = await response.json();
    
    console.log('=== КОЛЛЕКЦИИ DIRECTUS ===');
    console.log(JSON.stringify(collections, null, 2));

    // Получаем детали каждой коллекции
    for (const collection of collections.data) {
      console.log(`\n=== КОЛЛЕКЦИЯ: ${collection.collection} ===`);
      
      const fieldsResponse = await fetch(`${DIRECTUS_URL}/fields/${collection.collection}`, {
        headers: {
          'Authorization': `Bearer ${DIRECTUS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (fieldsResponse.ok) {
        const fields = await fieldsResponse.json();
        console.log(JSON.stringify(fields, null, 2));
      }
    }

  } catch (error) {
    console.error('Ошибка при получении схемы:', error);
  }
}

getDirectusSchema();
