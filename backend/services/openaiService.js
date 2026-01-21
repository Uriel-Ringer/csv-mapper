import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function inferFieldsBatch(products) {
  
  try {
    const prompt = `You are an expert in eyewear product data. You need to map this data to the format written below..

INPUT PRODUCTS (standardized format):
${JSON.stringify(products, null, 2)}

Please note - The lines are divided into groups, and they are identified by consecutive numbers, So if a row from the group DOSE NOT HAVE data in some of the columns, you NEED to copy the value from the row in the group that does have the value. ADD + to all copied data to indicate that it is copied. - data IS NOT transferred from group to group.

1. **brand**: Brand name (e.g., "Oceanglasses", "Ray-Ban" etc.)
2. **gender**: Men | Women | Unisex | Kids
3. **frameShape**: Rectangle | Aviator | Round | Cat Eye | Square | Wrap | Oval
4. **collection**: (e.g., Summer, Kids, Sport, Premium etc.)  inferred to description
5. **description**: Short one-line summary (max 10 words)
6. **colorDescription**: Color style description (e.g., "Shiny black", "Matte blue", "Gloss gold")
7. **color**: Primary color name (Black, Brown, Blue, Green, etc.)
8. **season**: All Year | Spring/Summer | Fall/Winter | Back to School
9. **rimType**: Full | Semi | Rimless
10. **hingeType**: Spring | Standard | Flex
11. **frameMaterial**: Frame composition material
12. **lensWidth**: Lens width dimension
13. **bridgeWidth**: Bridge width dimension
14. **templeLength**: Temple length dimension
15. **lensHeight**: Lens height dimension
16. **Manufacturer model**: Product model inferred to description

Return JSON in this format:
{
  "results": [
    {
      "index": 0,
      "brand": "string",
      "gender": "Men|Women|Unisex|Kids",
      "frameShape": "Rectangle|Aviator|Round|Cat Eye|Square|Wrap|Oval",
      "collection": "string",
      "description": "SHORT one-line summary (max 10 words)",
      "colorDescription": "string (e.g., Shiny black, Matte blue)",
      "color": "string (e.g., Black, Brown, Blue)",
      "season": "All Year|Spring/Summer|Fall/Winter|Back to School",
      "rimType": "Full|Semi|Rimless",
      "hingeType": "Spring|Standard|Flex",
      "frameMaterial": "string",
      "lensWidth": "string",
      "bridgeWidth": "string",
      "templeLength": "string",
      "lensHeight": "string",
      "ManufacturerModel": "string"
    }
  ]
}

IMPORTANT: 
- Return ONLY valid JSON
- MUST include "index" field matching the product's position
- Keep description concise and descriptive`;

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: "You are an expert at analyzing eyewear product data and inferring missing fields with high accuracy. Always return valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 4000
    });

    const result = JSON.parse(response.choices[0].message.content);
    
    if (!result.results || !Array.isArray(result.results)) {
      throw new Error('Invalid response format from OpenAI');
    }

    return result.results;
  } catch (error) {
    // TODO: catch format Error
    console.error('OpenAI API Error:', error);
    throw new Error(`Failed to infer fields: ${error.message}`);
  }
}

export async function inferFieldsInBatches(groups, batchSize = 5) {
  const results = [];
  
  console.log(`\n📦 Processing ${groups.length} product families`);
  
  // Process each group as a separate batch
  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    
    const batchResults = await inferFieldsBatch(group);
    results.push(...batchResults);
    
    if (i + 1 < groups.length) {
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  
  console.log(`\n✅ Processing complete: ${results.length} products enriched\n`);
  return results;
}