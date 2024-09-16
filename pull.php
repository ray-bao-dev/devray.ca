<?php
// Use in the “Post-Receive URLs” section of your GitHub repo.
if ( $_POST['Payload'] ) {
   shell_exec('cd ~/public_html && git pull');
}
?>