import { createClient } from "contentful";
import Image from "next/image";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_KEY,
});

export const getStaticPaths = async () => {
  const res = await client.getEntries({
    content_type: "recipe",
  });

  const paths = res.items.map((item) => {
    return {
      params: { slug: item.fields.slug },
    };
  });

  return {
    paths: paths,
    fallback: false,
  };
};

export async function getStaticProps({ params }) {
  const { items } = await client.getEntries({
    content_type: "recipe",
    "fields.slug": params.slug,
  });

  return {
    props: { recipe: items[0] },
  };
}

export default function RecipeDetails({ recipe }) {
  const {
    featuredImage,
    title,
    cookingTime,
    ingredients,
    method,
  } = recipe.fields;
  return (
    <div>
      <div className='banner'>
        <Image
          src={`https:${featuredImage.fields.file.url}`}
          width='900px'
          height='300px'
        />
        <h2>{title}</h2>
      </div>

      <div className='info'>
        <p>Takes about {cookingTime} mins to cook</p>
        <h3>Ingredients:</h3>

        {ingredients.map((ing) => (
          <span key={ing}>{ing}</span>
        ))}
      </div>
    </div>
  );
}
