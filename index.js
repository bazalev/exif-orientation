document.querySelector('input[type="file"]').addEventListener('change', function() {
    var img = new Image();
    img.src = URL.createObjectURL(this.files[0]);
    img.onload = function() {
        applyOrientaion(img, function() {
            var resImg = this;
            var resCanvas = document.querySelector('canvas');
            resCanvas.width = resImg.width;
            resCanvas.height = resImg.height;
            resCanvas.getContext('2d').drawImage(resImg, 0, 0);
        });
    };
});


/**
 * Apply EXIF orientation to image by properly rotating, flipping and so on
 * http://jpegclub.org/exif_orientation.html
 * http://stackoverflow.com/a/30242954/2699730
 *
 * @external "EXIF" - see https://github.com/exif-js/exif-js
 * @param img {Element} - input image
 * @param callback {callback(ImageData)} -
 */
function applyOrientaion(img, callback) {
    var canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    EXIF.getData(img, function() {
        var orientation = EXIF.getTag(img, 'Orientation');
        var w = img.width;
        var h = img.height;

        switch(orientation){
            case 1:
                canvas.width = w;
                canvas.height = h;
                // do nothing
                break;
            case 2:
                // horizontal flip
                canvas.width = w;
                canvas.height = h;
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
                break;
            case 3:
                // 180° rotate left
                canvas.width = w;
                canvas.height = h;
                ctx.translate(w, h);
                ctx.rotate(Math.PI);
                break;
            case 4:
                // vertical flip
                canvas.width = w;
                canvas.height = h;
                ctx.translate(0, h);
                ctx.scale(1, -1);
                break;
            case 5:
                // vertical flip + 90 rotate right
                canvas.width = h;
                canvas.height = w;
                ctx.rotate(0.5 * Math.PI);
                ctx.scale(1, -1);
                break;
            case 6:
                // 90° rotate right
                canvas.width = h;
                canvas.height = w;
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(0, -h);
                break;
            case 7:
                // horizontal flip + 90 rotate right
                canvas.width = h;
                canvas.height = w;
                ctx.rotate(0.5 * Math.PI);
                ctx.translate(w, -h);
                ctx.scale(-1, 1);
                break;
            case 8:
                // 90° rotate left
                canvas.width = h;
                canvas.height = w;
                ctx.rotate(-0.5 * Math.PI);
                ctx.translate(-w, 0);
                break;
        }
        ctx.drawImage(img, 0, 0);

        var resImg = new Image();
        resImg.onload = callback;
        resImg.src = canvas.toDataURL();
    });
}