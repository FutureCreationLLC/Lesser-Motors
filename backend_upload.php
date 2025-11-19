<?php
if(empty($_FILES['files'])){echo 'No files uploaded';exit;}
$type=isset($_POST['type'])?$_POST['type']:'';
$allowed=['pragya','sedan','bus','backgrounds'];
if(!in_array($type,$allowed)){echo 'Invalid type';exit;}
$targetDir="../uploads/".$type."/";
if(!is_dir($targetDir)){mkdir($targetDir,0777,true);}
foreach($_FILES['files']['tmp_name'] as $index=>$tmpName){
    $filename=$_FILES['files']['name'][$index];
    move_uploaded_file($tmpName,$targetDir.$filename);
}
echo "Upload successful";
?>