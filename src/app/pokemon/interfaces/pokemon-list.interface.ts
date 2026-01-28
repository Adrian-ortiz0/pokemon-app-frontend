export interface PokemonListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
}

export interface PokemonWithSprite {
  id: string;
  name: string;
  url: string;
  sprite: string | null;
}

export interface PokemonDetailInterface {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: { slot: number; type: { name: string; url: string } }[];
}