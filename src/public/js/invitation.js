

(function() {    
    const menuList = document.querySelectorAll('.img-editor-menu-child > .img-editor-menu');
    const menuParentList = document.querySelectorAll('.img-editor-menu-parent > .menu-parent')


    //brush
    const brushInfo = {
        width: 5,
        color: '#000'
    }  
    const $inputColorPen = document.querySelector('#input-color-pen');
    const $ColorPickerDrawResult = document.querySelector('#color-picker-draw-result');
    const $inputWidthPen = document.querySelector('#input-width-pen');

    const $filterMenu = document.querySelector('ul.img-editor-menu-parent > li.menu-parent[data-menu="filter"]');


    //---------------공통
    const $inputCanvasBackgroundColor = document.querySelector('#input-canvas-background-color');
    $inputCanvasBackgroundColor.value = '#ffffff';
    const $inputCanvasBackgroundOpacity = document.querySelector('#input-canvas-background-opacity');
    
    const $inputAllFontColor = document.querySelector('#input-all-font-color');
    const $inputAllFontOpacity = document.querySelector('#input-all-font-opacity');
    
    //캔버스 크기 조정
    const $canvasContainer = document.querySelector('.canvas-container');
    const $inputCanvasHeight = document.querySelector('#input-canvas-height');
    const $btnStratchHeight = document.querySelector('#btn-stratch-height');
    
    //JSON
    const $txtJson = document.querySelector('#txt-json');
    const $btnLoadJson = document.querySelector('#btn-load-json');


    //----------------선택
    const $btnLayerUp = document.querySelector('#btn-layer-up');
    const $btnLayerDown = document.querySelector('#btn-layer-down');
    
    

    //텍스트
    const $txtText = document.querySelector('#txt-text');
    const $btnAddText = document.querySelector('#btn-add-text');
    const $selFontFamily = document.querySelector('#sel-font-family');
    const $inputColorFont = document.querySelector('#input-color-font');
    const $inputColorFontbox = document.querySelector('#input-color-fontbox');
    const $inputSizeFont = document.querySelector('#input-size-font');

    const $colorPickerFontResult = document.querySelector('#color-picker-font-result');
    const $colorPickerFontboxResult = document.querySelector('#color-picker-fontbox-result');

    //TODO: const input-size-font

    const fonts = ["Hi Melody", "Bagel Fat One", "Noto Sans KR", 'Roboto'];


     //지우개
     const eraserInfo = {
        width: 5,
        enableErasedObject: false
    }    
    const $btnAllClear = document.querySelector('#btn-all-clear'); //전체 삭제
    const $inputWidthEraser = document.querySelector('#input-width-eraser');


    //필터
    const $chkFilterList = document.querySelectorAll('.chk-filters');

    //gray level
    const $radioGrayList = document.querySelectorAll('.gray-level');

    //다운로드
    const $btnPicDownload = document.querySelector('#btn-pic-download');
    const $btnJsonDownload = document.querySelector('#btn-json-download');
    const $inputUploadPic = document.querySelector('#input-upload-pic');
    const $btnPicAdd = document.querySelector('#btn-pic-add');
    
    



    if(menuParentList && menuList) {

        menuParentList.forEach(item => {
            item.addEventListener('click', e => {                

                switch(e.target.dataset.menu) {
                    case 'sel':
                        canvas.isDrawingMode = false;
                        break;
                    
                    case 'filter':
                        
                        break;
                    
                    case 'pen':                                                 
                        canvas.isDrawingMode = true;
                        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
                        canvas.freeDrawingCursor = getDrawCursor(brushInfo.width, brushInfo.color);
                        canvas.freeDrawingBrush.width = brushInfo.width;
                        canvas.freeDrawingBrush.color = brushInfo.color;
                        
                        break;
                    case 'eraser':
                        canvas.isDrawingMode = true;
                        canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
                        canvas.freeDrawingCursor = getDrawCursor(eraserInfo.width, '#ffffff');                        
                        canvas.freeDrawingBrush.width = eraserInfo.width;                        
                        canvas.freeDrawingBrush.color = '#ffffff';                        
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

    const getDrawCursor = (brushWidth, brushColor) => {
        
        const brushSize = parseInt(brushWidth);        
        const brushSizeDouble = brushSize * 2;
        console.log(`brushSize : ${brushSize}, double: ${brushSizeDouble}`);

        const circle = `
            <svg
                height="${ brushSize }"
                fill="${ brushColor }"
                viewBox="0 0 ${ brushSizeDouble } ${ brushSizeDouble }"
                width="${ brushSize }"
                xmlns="http://www.w3.org/2000/svg"
                >
                <circle
                    cx="50%"
                    cy="50%"
                    r="${ brushSize }" 
                />
            </svg>
        `;
        const coordinate = brushSize / 2;
        return `url(data:image/svg+xml;base64,${ window.btoa(circle) }) ${coordinate} ${coordinate}, crosshair`;
    };

    //canvas
    let canvas = this.__canvas = new fabric.Canvas('canvas', {
        freeDrawingCursor: getDrawCursor(),
        backgroundColor: '#ffffff'
    });
    
    console.dir(canvas);


    
    

    //const cursorUrl = 'https://ossrs.net/wiki/images/figma-cursor.png';

    //canvas.freeDrawingCursor = `url(" ${cursorUrl} ") 0 0, auto`;
    /*
    canvas.defaultCursor = `url(" ${cursorUrl} "), auto`;
    canvas.hoverCursor = `url(" ${cursorUrl} "), auto`; 
    canvas.moveCursor = `url(" ${cursorUrl} "), auto`;  
*/
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
        console.log(selectedObj.type);

        $filterMenu.classList.add('hidden');        
        
        switch(selectedObj.type) {
            case 'group':

                break;
            case 'image': //이미지라면
                $filterMenu.classList.remove('hidden');
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
                $inputSizeFont.value = selectedObj.fontSize;                
                $inputSizeFont.dispatchEvent(new Event("change"));
                $colorPickerFontResult.style.backgroundColor = selectedObj.fill;
                $colorPickerFontboxResult.style.backgroundColor = selectedObj.backgroundColor;                
                break;
            case 'path': //pen
                changeTool('sel');
                break;
        }
    }
    canvas.on({
        'selection:created': selectionProc,
        'selection:updated': selectionProc,
        'selection:cleared': function() { //선택이 해제된다면
            $filterMenu.classList.add('hidden'); //필터 hidden
            changeTool('sel'); //선택으로 이동

            selectedObj = null;
            $chkFilterList.forEach(item => {
                item.checked = false;
            });
        }
    });
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.erasable = true;


    //--------------------------------------------------------------   공통

    function getAlphaColor(color, opacity) {
        return color + (opacity === '255' ? '' : parseInt(opacity).toString(16).padStart(2, '0'));
    }

    
    if($inputCanvasBackgroundColor && $inputCanvasBackgroundOpacity && $inputAllFontColor) {

        function changeCanvasBackgroundColor() {
            canvas.backgroundColor = getAlphaColor($inputCanvasBackgroundColor.value, $inputCanvasBackgroundOpacity.value);
            canvas.requestRenderAll();
        }

        $inputCanvasBackgroundColor.addEventListener('input', changeCanvasBackgroundColor, false);    
        $inputCanvasBackgroundOpacity.addEventListener('input', changeCanvasBackgroundColor, false);    
    
        
        function changeAllFontColor() {
            const color = getAlphaColor($inputAllFontColor.value, $inputAllFontOpacity.value);
            const list = canvas.getObjects('textbox');
            list.forEach(item => {
                item.set({fill: color});
            });     
            canvas.requestRenderAll();   
        }
        
        
        $inputAllFontColor.addEventListener('input', changeAllFontColor, false);
        $inputAllFontOpacity.addEventListener('input', changeAllFontColor, false);
        
    }
    
    

    //--------------------------------------------------------------   선택
    

    $btnLayerUp.addEventListener('click', e => {
        canvas.sendBackwards(selectedObj);
        canvas.requestRenderAll();
    });

    $btnLayerDown.addEventListener('click', e => {
        canvas.sendToBack(selectedObj);
        canvas.requestRenderAll();
    });

    $btnStratchHeight.addEventListener('click', e => {
        const height = parseInt($inputCanvasHeight.value);

        if(height < 300) {
            alert('캔버스 높이 300 미만은 안 됩니다.');
            return;            
        } else if (height > 3000) {
            alert('캔버스 높이 3000 초과는 안 됩니다.');
            return;
        }

        canvas.setHeight(height);
        $canvasContainer.style.height= `${height}px`;
        canvas.renderAll();
    });

    //-----------------------------------------------------------------   텍스트
   
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
        if(!$txtText.value) { return; }
        const txt = new fabric.Textbox( $txtText.value, {
            fontFamily: $selFontFamily.value,
            fill:  $inputColorFont.value,
            backgroundColor: $inputColorFontbox.value,
            fontSize: $inputSizeFont.value
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

    //폰트 색상
    if($colorPickerFontResult) {
        $colorPickerFontResult.addEventListener('click', e => {
            $inputColorFont.click();
        });        
    }
    if($inputColorFont) {
        function commonFn(e) {
            if(selectedObj && selectedObj.type === 'textbox') { //텍스트라면 폰트 색상 변경
                setTimeout(function() {
                    selectedObj.set({fill: e.target.value});
                    canvas.renderAll();
                }, 100);
            }
            $colorPickerFontResult.style.backgroundColor = e.target.value;
        }
        $inputColorFont.addEventListener('input', commonFn, false)
        $inputColorFont.addEventListener('change', commonFn, false);
    }

    //폰트 박스 색상
    if($colorPickerFontboxResult) {
        $colorPickerFontboxResult.addEventListener('click', e => {
            $inputColorFontbox.click();
        });
    }

    if($inputColorFontbox) {
        function commonFn(e) {
            if(selectedObj && selectedObj.type === 'textbox') { //텍스트라면 폰트박스 색상 변경
                setTimeout(function() {
                    selectedObj.set({backgroundColor: e.target.value});
                    canvas.renderAll();
                }, 100);
                
            }
            $colorPickerFontboxResult.style.backgroundColor = e.target.value;
        }
        $inputColorFontbox.addEventListener('input', commonFn, false)
        $inputColorFontbox.addEventListener('change', commonFn, false);
    }

    if($inputSizeFont) {
        function commonFn(e) {
            if(selectedObj && selectedObj.type === 'textbox') { //텍스트라면 폰트박스 색상 변경
                setTimeout(function() {
                    selectedObj.set({fontSize: e.target.value});
                    canvas.renderAll();
                }, 100);                
            }
            e.target.previousElementSibling.innerText = e.target.value;
        }

        $inputSizeFont.addEventListener('input', commonFn, false);
        $inputSizeFont.addEventListener('change', commonFn, false);
    }


    //------------------------------------------------------------------ 펜
    if($ColorPickerDrawResult) {
        $ColorPickerDrawResult.addEventListener('click', e => {
            $inputColorPen.click();
        });        
    }
    if($inputColorPen) {
        function commonFn(e) {
            const brushWidth = parseInt($inputWidthPen.value, 10) || 5;
            var brush = canvas.freeDrawingBrush;            
            $ColorPickerDrawResult.style.backgroundColor = brushInfo.color = brush.color = e.target.value;
            brush.color = brush.color + 'AA';
            canvas.freeDrawingCursor = getDrawCursor(brushWidth, brushInfo.color);
        }
        $inputColorPen.addEventListener('input', commonFn, false);
    }
    if($inputWidthPen) {
        $inputWidthPen.addEventListener('change', e => {
            const brushWidth = parseInt(e.target.value, 10) || 5;
            canvas.freeDrawingBrush.width = brushWidth;
            e.target.previousElementSibling.innerText = brushInfo.width = brushWidth;                 
            canvas.freeDrawingCursor = getDrawCursor(brushInfo.width, $inputColorPen.value);     
        });
    }


    //--------------------------------------------------------------------- 지우개   
    if($btnAllClear) {
        $btnAllClear.addEventListener('click', e => {
            canvas.clear();
        });
    }
    if($inputWidthEraser) {
        $inputWidthEraser.addEventListener('change', e => {
            canvas.freeDrawingBrush.width = eraserInfo.width = e.target.value;
            e.target.previousElementSibling.innerText = eraserInfo.width = e.target.value;     
            canvas.freeDrawingCursor = getDrawCursor(eraserInfo.width, '#ffffff');          
        });
    }

    const canvasFilter = fabric.Image.filters;

    //------------------------------------------------------------------- 필터   
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
    
    //--------------------------------------------------------------------- 다운로드    
    
    if($btnPicAdd) {
        $btnPicAdd.addEventListener('click', e => {
            const imgSrc = $inputUploadPic.value;
            if(imgSrc) {
                fabric.Image.fromURL(imgSrc, function(oImg) {
                   // oImg.set('erasable', false);  //이미지 부분 삭제불가                   
                    
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

    //----------------------------------------------------------------  JSON 다운로드
    $btnLoadJson.addEventListener('click', e => {
        const json = $txtJson.value;
        canvas.loadFromJSON(json);
    })

    const downloadJson= () => {
        const saveJson = JSON.stringify(canvas);
        console.log(saveJson);
    };
    $btnJsonDownload.addEventListener('click', downloadJson);

})();