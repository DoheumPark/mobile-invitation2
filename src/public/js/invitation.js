

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

    function changeTool(tool) {
        menuParentList.forEach(item => {
            if(item.dataset.menu === tool) {
                item.click();
            }
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

    function selectionProc() {
        selectedObj = canvas.getActiveObject();
        console.log(selectedObj);
        
        switch(selectedObj.type) {
            case 'group':

                break;
            case 'image': //이미지라면

                //changeTool('filter');
                $chkFilterList.forEach(item => {
                    item.checked = false;
                }); 
                selectedObj.filters.forEach((item, idx) => {
                    console.log(idx);
                    document.querySelector(`#chk-filter-${idx}`).checked = item && true;
                });
                break;
            case 'textbox': //text
                changeTool('textbox');
                $selFontFamily.value = selectedObj.fontFamily;
                $ColorPickerFontResult.style.backgroundColor = selectedObj.fill;
                break;
        }
    }
    canvas.on({
        'selection:created': selectionProc,
        'selection:updated': selectionProc,
        'selection:cleared': function() {
            selectedObj = null;
            $chkFilterList.forEach(item => {
                item.checked = false;
            });
        }
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.erasable = true;

    //선택
    const $btnLayerUp = document.querySelector('#btn-layer-up');
    const $btnLayerDown = document.querySelector('#btn-layer-down');
    const $canvasContainer = document.querySelector('.canvas-container');
    const $btnStratchHeight = document.querySelector('#btn-stratch-height');

    $btnLayerUp.addEventListener('click', e => {
        canvas.sendBackwards(selectedObj);
        canvas.requestRenderAll();
    });

    $btnLayerDown.addEventListener('click', e => {
        canvas.sendToBack(selectedObj);
        canvas.requestRenderAll();
    });

    $btnStratchHeight.addEventListener('click', e => {
        canvas.setHeight(canvas.height + 1);
        $canvasContainer.style.height= `${canvas.height}px`;
        canvas.renderAll();
    });

    //텍스트
    const $txtText = document.querySelector('#txt-text');
    const $btnAddText = document.querySelector('#btn-add-text');
    const $selFontFamily = document.querySelector('#sel-font-family');
    const $inputColorFont = document.querySelector('#input-color-font');
    const $ColorPickerFontResult = document.querySelector('#color-picker-font-result');
    //TODO: const input-size-font

    const fonts = ["Hi Melody", "Bagel Fat One", "Noto Sans KR", 'Roboto'];

    fonts.forEach(item => {
        const option = document.createElement('option');
        option.innerHTML = item;
        $selFontFamily.appendChild(option);
    })

    $txtText.addEventListener('focus', e => {        
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    });

    $btnAddText.addEventListener('click', e => {
        const txt = new fabric.Textbox( $txtText.value, {
            fontFamily: $selFontFamily.value,
            fill:  $inputColorFont.value
        });
        canvas.add(txt);
        $txtText.value = '';
    });

    $selFontFamily.addEventListener('change', e => {
        if(selectedObj) {
            loadAndUse(e.target.value);
            canvas.requestRenderAll();
        }
    });

    function loadAndUse(font) {
        var myfont = new FontFaceObserver(font)
        myfont.load()
          .then(function() {
            // when font is loaded, use it.
            selectedObj.set("fontFamily", font);
            canvas.requestRenderAll();
          }).catch(function(e) {
            console.log(e)
            alert('font loading failed ' + font);
          });
    }

    if($ColorPickerFontResult) {
        $ColorPickerFontResult.addEventListener('click', e => {
            $inputColorFont.click();
        });        
    }
    if($inputColorFont) {
        function commonFn(e) {
            if(selectedObj && selectedObj.type === 'textbox') { //텍스트라면 폰트 색상 변경
                selectedObj.set({fill: e.target.value});
                canvas.renderAll();
            }
            $ColorPickerFontResult.style.backgroundColor = e.target.value;
        }
        $inputColorFont.addEventListener('input', commonFn, false)
        $inputColorFont.addEventListener('change', commonFn, false);
    }

    //펜
    const brushInfo = {
        width: 5,
        color: '#000'
    }  
    const $inputColorPen = document.querySelector('#input-color-pen');
    const $ColorPickerDrawResult = document.querySelector('#color-picker-draw-result');
    const $inputWidthPen = document.querySelector('#input-width-pen');

    if($ColorPickerDrawResult) {
        $ColorPickerDrawResult.addEventListener('click', e => {
            $inputColorPen.click();
        });        
    }
    if($inputColorPen) {
        function commonFn(e) {
            var brush = canvas.freeDrawingBrush;            
            $ColorPickerDrawResult.style.backgroundColor = brushInfo.color = brush.color = e.target.value;
        }
        $inputColorPen.addEventListener('input', commonFn, false);
        $inputColorPen.addEventListener('change', commonFn, false);
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

    //gray level
    const $radioGrayList = document.querySelectorAll('.gray-level');
    $radioGrayList.forEach(item => {
        item.addEventListener('click', e => {

        });
    })


    if($chkFilterList) {
        $chkFilterList.forEach(item => {

            if(item.dataset.filter === 'Grayscale') {
                item.addEventListener('change', e => {
                    $radioGrayList.forEach(subItem => {
                        subItem.disabled = !e.target.checked;
                    });                    
                })
            }

            item.addEventListener('click', e => {
                console.log(e.target.dataset.index);
                const data = e.target.dataset;
                applyFilter(data.index, item.checked && new canvasFilter[data.filter]());
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

    function applyFilterValue(index, prop, value) {
        var obj = canvas.getActiveObject();
        if (obj.filters[index]) {
          obj.filters[index][prop] = value;
          obj.applyFilters();
          canvas.renderAll();
        }
    }   
    
    // 다운로드
    const $btnPicDownload = document.querySelector('#btn-pic-download');
    const $btnJsonDownload = document.querySelector('#btn-json-download');
    const $inputUploadPic = document.querySelector('#input-upload-pic');
    const $btnPicAdd = document.querySelector('#btn-pic-add');
    
    //JSON
    const $txtJson = document.querySelector('#txt-json');
    const $btnLoadJson = document.querySelector('#btn-load-json');

    $btnLoadJson.addEventListener('click', e => {
        const json = $txtJson.value;
        canvas.loadFromJSON(json);
    })


    let canvasPicInstance = null;
    let erasingRemovesErasedObjects = false;
    
    if($btnPicAdd) {
        $btnPicAdd.addEventListener('click', e => {
            const imgSrc = $inputUploadPic.value;
            if(imgSrc) {
                fabric.Image.fromURL(imgSrc, function(oImg) {
                   // oImg.set('erasable', false);  //이미지 부분 삭제불가                   
                    canvasPicInstance = oImg;
                    canvas.add(oImg);
                  }, { crossOrigin: 'Anonymous'});
            }
        })
    }
     
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
    $btnPicDownload.addEventListener('click', downloadImage);

    //JSON 다운로드
    const downloadJson= () => {
        const saveJson = JSON.stringify(canvas);
        console.log(saveJson);
    };
    $btnJsonDownload.addEventListener('click', downloadJson);
})();