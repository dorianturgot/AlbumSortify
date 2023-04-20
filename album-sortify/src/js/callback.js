const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const state = params.get("state");

if (state === "authenticated" && code) {
  const accessToken = await getAccessToken(clientId, code);
  localStorage.setItem('accessToken', accessToken);
  redirectToHome();
}