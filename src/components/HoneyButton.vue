<script setup lang="ts">
defineProps<{
  label: string
  dark?: boolean
}>()
</script>

<template>
  <!-- <div class="buttons"> -->
  <div class="blob-btn" :class="dark ? 'blob-btn-dark': ''">
    {{ label }}
    <span class="blob-btn__inner">
      <span class="blob-btn__blobs">
        <span class="blob-btn__blob" :class="dark ? 'blob-dark': ''"></span>
        <span class="blob-btn__blob" :class="dark ? 'blob-dark': ''"></span>
        <span class="blob-btn__blob" :class="dark ? 'blob-dark': ''"></span>
        <span class="blob-btn__blob" :class="dark ? 'blob-dark': ''"></span>
      </span>
    </span>
  </div>

  <svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="absolute -left-100">
    <defs>
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="10"></feGaussianBlur>
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 21 -7" result="goo"></feColorMatrix>
        <feBlend in2="goo" in="SourceGraphic" result="mix"></feBlend>
      </filter>
    </defs>
  </svg>
<!-- </div> -->
</template>

<style scoped lang="scss">
*, *:before, *:after {
  margin: 0;
  padding: 0;
}
$openSans: 'Open Sans', Helvetica, Arial, sans-serif;
body {
  font-family: $openSans;
}

.buttons {
  text-align: center;
}

$borderW: 0px;

.blob-btn {
  overflow: hidden;
  $numOfBlobs: 3;
  z-index: 1;
  position: relative;
  text-align: center;
  text-transform: uppercase;
  // font-size: 16px;
  font-weight: bold;
  background-color: transparent;
  outline: none;
  transition: color 0.5s;
  cursor: pointer;
  padding: 5px 12px 5px 12px;

  text-decoration: none;
  color: var(--primary-color);
  transition: 0.4s;
  border-radius: 0.7em;
  font-family: var(--font-pixel);
  border: var(--terciary-color-mute),2px,solid;


  &:before {
    content: "";
    z-index: 1;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  &:after {
    content: "";
    z-index: -2;
    position: absolute;
    width: 100%;
    height: 100%;
    transition: all 0.3s 0.2s;
  }

  &:hover {
    // color: var(--color-terciary-mute);
    // border-color: var(--color-primary);

    &:after {
      transition: all 0.3s;
      left: 0;
      top: 0;
    }
  }

  &__inner {
    z-index: -1;
    overflow: hidden;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  // additional container created, because in FF blobs are breaking overflow:hidden of element with svg gooey filter
  &__blobs {
    position: relative;
    display: block;
    height: 100%;
    filter: url('#goo');
  }

  &__blob {
    position: absolute;
    top: $borderW;
    width: 100% / $numOfBlobs;
    height: 100%;
    // background: var(--color-primary);
    background: var(--color-terciary-mute);
    border-radius: 100%;
    transform: translate3d(0,150%,0) scale(1.7);
    transition: transform 0.45s;

    @supports(filter: url('#goo')) {
      transform: translate3d(0,150%,0) scale(1.4);
    }

    @for $i from 1 through $numOfBlobs {
      &:nth-child(#{$i}) {
        left: ($i - 1) * (120% / $numOfBlobs);
        transition-delay: ($i - 1) * 0.08s;
      }
    }

    .blob-btn:hover & {
      transform: translateZ(0) scale(1.7);

      @supports(filter: url('#goo')) {
        transform: translateZ(0) scale(1.4);
      }
    }
  }



}

.blob-dark {
  background: var(--color-primary);
}

.blob-btn-dark {
  background: var(--color-terciary-mute);
  &:hover {
    color: var(--color-terciary-mute);
    border-color: var(--color-primary);
  }
}
</style>
