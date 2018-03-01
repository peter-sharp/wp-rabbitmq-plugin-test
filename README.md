
### how it works
(of the top of my head) it connects/creates a 'post_updated' rabbitmq channel the adds the json of the updated post as a message to the queue. When the node server is spun up it connects to the same channel and 'consumes' any messages left on the post_update channel.

### setup
[rabbitmq setup instructions](https://www.rabbitmq.com/download.html)
php needed extensions bcmath and mbstring (likely enabled by default)

to setup run (todo get this to work):
```bash
> composer create-project rabbitmqtest peter/rabbitmq --repository https://github.com/peter-sharp/wp-rabbitmq-plugin-test.git
```
(info on create project [here](https://getcomposer.org/doc/03-cli.md#create-project))
