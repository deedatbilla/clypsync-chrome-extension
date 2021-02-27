setTimeout(
  async () => console.log(await window.navigator.clipboard.readText()),
  500
);
