export function initCustomCursor() {
  const cursor = document.getElementById("customCursor");
  const dot = document.getElementById("customCursorDot");

  if (!cursor || !dot || window.innerWidth < 768) return;

  document.body.classList.add("has-custom-cursor");

  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let animationFrame = 0;
  let hasPointerPosition = false;

  function followPointer() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    if (Math.abs(targetX - currentX) > 0.1 || Math.abs(targetY - currentY) > 0.1) {
      animationFrame = window.requestAnimationFrame(followPointer);
    } else {
      animationFrame = 0;
    }
  }

  document.addEventListener("mousemove", (event) => {
    targetX = event.clientX;
    targetY = event.clientY;
    cursor.classList.add("is-visible");
    dot.classList.add("is-visible");
    dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;

    if (!hasPointerPosition) {
      currentX = targetX;
      currentY = targetY;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      hasPointerPosition = true;
    }

    if (!animationFrame) {
      animationFrame = window.requestAnimationFrame(followPointer);
    }
  });

  document.addEventListener("mouseleave", () => {
    cursor.classList.remove("is-visible");
    dot.classList.remove("is-visible");
    hasPointerPosition = false;
  });
}
