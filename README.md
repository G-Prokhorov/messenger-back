<h1>Messenger</h1>
<p><b>Messenger</b> – telegram prototype that supports text and image
messages.</p>
<h2>Install</h2>
<ol>
    <li>Create folder 'messenger';</li>
    <li><code>git clone https://github.com/G-Prokhorov/messenger-back.git</code>;</li>
    <li><code>git clone https://github.com/G-Prokhorov/messenger-front.git</code>;</li>
    <li>Go to folder 'messenger-front' (<code>cd messenger-front</code>);</li>
    <li><code>npm install</code>;</li>
    <li><code>npm build</code>;</li>
    <li>Copy folder 'dist' to messenger-back/gateWay/public (<code>cp -r dist/ ../messenger-back/gateWay/public</code>);</li>
    <li>Create file '.env' with schema: <br/>'
        <b>DB_HOST</b>=db <br/>
        <b>DB_USER=</b> Username for db, for further connection<br/>
        <b>DB_PASS=</b> Password for db, for further connection<br/>
        <b>REDIS_HOST=</b>redis <br/>
        <b>TOKEN=</b> token for JWT<br/>
        <b>REFRESH_TOKEN=</b> token for JWT<br/>
        <b>EMAIL=</b> your email for send the code to the user<br/>
        <b>PASSWORD_EMAIL=</b> password from email
    ';</li>
    <li>Create folder '.aws' with file 'credentials';</li>
    <li>In 'credentials': '
        [default] <br/>
        aws_access_key_id = <br/> 
        aws_secret_access_key =
    ' (AWS credentials);</li>
    <li><code>docker-compose build</code></li>
    <li><code>docker-compose up</code></li>
    <li>Connect to db container (<code>docker exec -it db sh</code>);</li>
    <li>Connect to postgreSQL (<code>psql --username=yourname --host=db --dbname=messenger</code>);</li>
    <li>Switch db to messenger (<code>\connect messenger</code>);</li>
    <li>From file 'script.sql' insert the db schema;</li>
    <li>Exit from psql (<code>\q</code>), exit from bash (<code>exit</code>);</li>
    <li>Go to <code>localhost:8080</code></li>
    <li><b>Have a nice user!</b></li>
</ol>