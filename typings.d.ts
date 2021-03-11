declare module 'top_cards.json' {
  const value: {
    frames: Array<any>;
    meta: {
      app: string;
      version: string;
      image: string;
      size: { w: number; h: number };
      scale: number;
    };
  }
  export default value
}
