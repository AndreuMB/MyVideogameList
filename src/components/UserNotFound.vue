<template>
  <img
    class="absolute top-0 left-0 -z-10"
    height="125"
    width="125"
    src="/src/assets/spidernet.png"
    alt="net"
  />

  <div class="flex items-center justify-center p-25 gap-10">
    <img src="/src/assets/profile.png" alt="profile" width="500" height="500" />
    <div>
      <p class="mb-5 text-6xl">USER NOT EXIST, ARE YOU STALKING SOMEONE??</p>
      <RouterLink to="/games" class="text-terciary hover:text-terciary-soft text-2xl">
        LETS GET BACK
      </RouterLink>
    </div>
  </div>
</template>
