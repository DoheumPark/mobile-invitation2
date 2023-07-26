

(function() {
    const menuList = document.querySelectorAll('.img-editor-menu-child > .img-editor-menu');
    const menuParentList = document.querySelectorAll('.img-editor-menu-parent > .menu-parent')

    if(menuParentList && menuList) {
        menuParentList.forEach(item => {
            item.addEventListener('click', e => {
                switch(e.target.dataset.menu) {
                    case 'sel':
                        canvas.isDrawingMode = false;
                        break;
                    case 'pen':                         
                        canvas.isDrawingMode = true;
                        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                        canvas.freeDrawingBrush.width = brushInfo.width;
                        canvas.freeDrawingBrush.color = brushInfo.color;
                        break;
                    case 'eraser':
                        canvas.isDrawingMode = true;
                        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
                        canvas.freeDrawingBrush.width = eraserInfo.width;                        
                        break;
                }

                menuList.forEach(subItem => {                    
                    subItem.classList.toggle('show', e.target.dataset.menu === subItem.dataset.menu);
                });
            });
        });
    }

    //delete key event
    document.addEventListener('keyup', e => {        
        if(e.key === 'Delete') {
            if(selectedObj) {
                canvas.remove(selectedObj);
                selectedObj = null;
            }
        }
    });

    let selectedObj = null;

    //canvas      
    let canvas = this.__canvas = new fabric.Canvas('canvas', {});
    // canvas.on('mouse:up', options => {
    //     console.log(options.e);
    // });
/*
    canvas.on('erasing:end', ({ targets, drawables }) => {        

        if(eraserInfo.enableErasedObject) {
            targets.forEach(obj => { 
                console.log();
                !obj.cacheKey && (obj.group?.removeWithUpdate(obj) || canvas.remove(obj))
            });
        }
    }, { crossOrigin: "anonymous" });
*/
    canvas.on({
        'selection:created': function() {
            selectedObj = canvas.getActiveObject();
            console.log(selectedObj);
        },
        'selection:cleared': function() {
            selectedObj = null;
        }
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.erasable = true;



    //펜
    const brushInfo = {
        width: 5,
        color: '#000'
    }  
    const $inputColorPen = document.querySelector('#input-color-pen');
    const $ColorPickerResult = document.querySelector('#color-picker-result');
    const $inputWidthPen = document.querySelector('#input-width-pen');

    if($ColorPickerResult) {
        $ColorPickerResult.addEventListener('click', e => {
            $inputColorPen.click();
        });        
    }
    if($inputColorPen) {
        $inputColorPen.addEventListener('change', e => {
            var brush = canvas.freeDrawingBrush;            
            $ColorPickerResult.style.backgroundColor = brushInfo.color = brush.color = e.target.value;
        })
    }
    if($inputWidthPen) {
        $inputWidthPen.addEventListener('change', e => {
            canvas.freeDrawingBrush.width = parseInt(e.target.value, 10) || 5;
            e.target.previousElementSibling.innerText = brushInfo.width = e.target.value;            
        });
    }


    //지우개
    const eraserInfo = {
        width: 5,
        enableErasedObject: false
    }
    //const $chkEnableErase = document.querySelector('#chk-enable-erase'); //객체 삭제
    const $btnAllClear = document.querySelector('#btn-all-clear'); //전체 삭제
    const $inputWidthEraser = document.querySelector('#input-width-eraser');

    // if($chkEnableErase) {
    //     $chkEnableErase.addEventListener('change', e => {
    //         eraserInfo.enableErasedObject = e.target.checked;
    //     });
    // }
    if($btnAllClear) {
        $btnAllClear.addEventListener('click', e => {
            canvas.clear();
        });
    }
    if($inputWidthEraser) {
        $inputWidthEraser.addEventListener('change', e => {
            canvas.freeDrawingBrush.width = eraserInfo.width = e.target.value;
            e.target.previousElementSibling.innerText = brushInfo.width = e.target.value;            
        });
    }

    const canvasFilter = fabric.Image.filters;

    //필터
    const $chkFilterList = document.querySelectorAll('.chk-filters');
    if($chkFilterList) {
        $chkFilterList.forEach(item => {
            item.addEventListener('click', e => {
                console.log(e.target.dataset.index);
                const data = e.target.dataset;
                applyFilter(data.index, new canvasFilter[data.filter]());
            })
        })
    }

    function applyFilter(index, filter) {
        var obj = canvas.getActiveObject();
        if(obj) {
            obj.filters[index] = filter;            
            obj.applyFilters();
            canvas.renderAll();
        }
       
      }
    
    
    
    const $btnDownload = document.querySelector('#btn-download');
    const $inputUploadPic = document.querySelector('#input-upload-pic');
    const $btnPicAdd = document.querySelector('#btn-pic-add');
    const $btnDeletePic = document.querySelector('#btn-delete-pic');

    let canvasPicInstance = null;
    let erasingRemovesErasedObjects = false;

    if($btnDeletePic) {
        $btnDeletePic.addEventListener('click', e => {
            if(canvasPicInstance) {
                canvas.remove(canvasPicInstance);
            }
        });
    }

    if($btnPicAdd) {
        $btnPicAdd.addEventListener('click', e => {
            const imgSrc = $inputUploadPic.value;
            if(imgSrc) {
                fabric.Image.fromURL(imgSrc, function(oImg) {
                    oImg.set('erasable', false);                    
                    canvasPicInstance = oImg;
                    canvas.add(oImg);
                  }, { crossOrigin: 'Anonymous'});
            }
        })
    }
    //http://127.0.0.1:5500/src/public/img/dd.jpg

    

    
    // $inputUploadPic.addEventListener('change', e => {        
    //     const selectedFile  = e.target.files[0];        
        
    //     const reader = new FileReader();
    //     reader.onload = (e) => {
    //         const img = document.createElement('img');   
    //         document.querySelector('body').append(img);        
    //         img.src = e.target.result;
    //         const dd = canvasPicInstance = new fabric.Image(img, {
    //             left: 10,
    //             top: 10,
    //             angle: 0,
    //             opacity: 0.85
    //         });
    //         canvas.add(dd);
    //         canvas.renderAll();    
    //     }
    //     reader.readAsDataURL(selectedFile);
        
    // })
   

   
    //다운로드 이미지
    const downloadImage = () => {
        const ext = "png";
        const base64 = canvas.toDataURL({
          format: ext,
          enableRetinaScaling: true
        });
        const link = document.createElement("a");
        link.href = base64;
        link.download = `eraser_example.${ext}`;
        link.click();
      };
    $btnDownload.addEventListener('click', downloadImage);
})();