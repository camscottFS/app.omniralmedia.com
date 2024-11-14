import md5 from "md5";

export const getGravatarUrl = async (email: string | undefined, size: number = 64): Promise<string> => {
  if (!email) return `https://www.gravatar.com/avatar/?d=mp&s=${size}`;

  const hashedEmail = md5(email.trim().toLowerCase());
  const gravatarUrl = `https://www.gravatar.com/avatar/${hashedEmail}.jpg?s=${size}&d=404`;

  try {
    // Check if the Gravatar actually exists
    const response = await fetch(gravatarUrl, { method: 'HEAD' });
    if (response.status === 200) {
      return gravatarUrl;
    } else {
      // Return the default Gravatar URL if no avatar exists
      return `https://www.gravatar.com/avatar/?d=mp&s=${size}`;
    }
  } catch (error) {
    // If there's an error during the fetch, fall back to the default
    console.error('Error checking Gravatar existence:', error);
    return `https://www.gravatar.com/avatar/?d=mp&s=${size}`;
  }
};