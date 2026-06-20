

class Helper {

    Hello = () => {
        // console.log("Hello");
        // console.log("Legendgggggggggg Lokesh");
    };

    /**
   * Generate image from text
   * @param {HTMLCanvasElement} canvas - ref.current from component
   * @param {string} text - text to render
   * @param {number} fontSize - optional font size
   * @param {string} bgColor - optional background color
   * @param {string} textColor - optional text color
   * @returns {string} base64 image URL
   */


    xx_generateTextImage = (
                canvas,
                text,
                fontSize = 32,
                bgColor = "transparent",
                textColor = "#000000"
            ) => {
                if (!canvas) return "";

                const ctx = canvas.getContext("2d");
                const padding = 20;

                ctx.font = `${fontSize}px Arial`;
                const textWidth = ctx.measureText(text).width;

                canvas.width = textWidth + padding * 2;
                canvas.height = fontSize + padding * 2;

                // background
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // text
                ctx.fillStyle = textColor;
                ctx.font = `${fontSize}px Arial`;
                ctx.fillText(text, padding, fontSize + padding / 2);

                // return base64 image
                return canvas.toDataURL("image/png");
    };


    // generateTextImage = (
    //     canvas,
    //     text,
    //     fontSize = 120,
    //     bgColor = "transparent",
    //     textColor = "#fff"
    //     ) => {
    //     if (!canvas) return "";

    //     const ctx = canvas.getContext("2d");
    //     const padding = 6;

    //     ctx.font = `${fontSize}px Arial`;

    //     // Calculate width
    //     const textWidth = ctx.measureText(text).width;
    //     canvas.width = textWidth + padding * 2;
    //     canvas.height = fontSize + padding * 5;

    //     // Clear / background
    //     ctx.clearRect(0, 0, canvas.width, canvas.height);
    //     if (bgColor !== "transparent") {
    //         ctx.fillStyle = bgColor;
    //         ctx.fillRect(0, 0, canvas.width, canvas.height);
    //     }

    //     // Draw each character with random rotation & position
    //     for (let i = 0; i < text.length; i++) {
    //         const char = text[i];
    //         const x = padding + i * (fontSize * 0.9);
    //         const y = fontSize + padding / 2;

    //         ctx.save(); // save state

    //         // random rotation between -0.3 to 0.3 radians (~ -17° to 17°)
    //         const angle = (Math.random() - 0.5) * 0.6;
    //         ctx.translate(x, y);
    //         ctx.rotate(angle);

    //         // random vertical displacement
    //         const dy = (Math.random() - 0.5) * 10;

    //         ctx.fillStyle = textColor;
    //         ctx.fillText(char, 0, dy);

    //         ctx.restore(); // restore state
    //     }

    //     // Add random lines / noise
    //     for (let i = 0; i < 5; i++) {
    //         ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
    //         ctx.beginPath();
    //         ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    //         ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    //         ctx.stroke();
    //     }

    //     // return base64 image
    //     return canvas.toDataURL("image/png");
    // };


generateTextImage = (
  canvas,
  text,
  fontSize = 130,
  bgColor = "transparent",
  textColor = "#fff"
) => {
  if (!canvas) return "";

  const ctx = canvas.getContext("2d");
  const padding = 6;
  const charSpacing = fontSize * 0.6;

 
  canvas.width = text.length * charSpacing + padding * 2;
  canvas.height = fontSize + padding * 4;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.textBaseline = "alphabetic";

  if (bgColor !== "transparent") {
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const x = padding + i * charSpacing;
    const y = fontSize + padding;

    ctx.save();

    const angle = (Math.random() - 0.5) * 0.6;
    ctx.translate(x, y);
    ctx.rotate(angle);

    const dy = (Math.random() - 0.5) * 10;

    ctx.fillStyle = textColor;
    ctx.fillText(char, 0, dy);

    ctx.restore();
  }

  
  for (let i = 0; i < 5; i++) {
    ctx.strokeStyle = `rgba(255,255,255,${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
    ctx.stroke();
  }

  return canvas.toDataURL("image/png");
};



     

}

export default new Helper();

 