
//b)db.js代码：
//定义数据库query函数，向外暴露
var mysql = require('mysql');
var data = {
    host: 'localhost',
    port: 3306,
    database: 'hzxy',
    user: 'root',
    password: '123456'
};

//向外暴露方法
// 分页查询全部话题信息
module.exports = {
    find: function (type,params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = ""
        sql = `select count(id) from sys_type where type=${type}`;
        // if (topic.createtime == "") {
        //     console.log("进来1")
        // } else {
        //     console.log("进来2")
        //     sql = 'select id,title,abstract,topic,heat,agree,comment,follow,brower,userid,topiccover,createtime,updatetime from topics where id like "%' + topic.id + '%" and title like "%' + topic.title + '%" and abstract like "%' + topic.abstract + '%" and heat > ' + topic.heat + ' and comment >' + topic.comment + ' and agree >' + topic.agree + ' and follow >' + topic.follow + ' and brower >' + topic.brower + ' and userid like "%' + topic.userid + '%" and createtime > ' + topic.createtime + ' limit ' + x + ',' + y;
        // }
        console.log('打印查询语句')
        console.log(sql)
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    // 查询记录总数
    findCount: function (id, params, callback) {
        let sql = `select count(${id}) from topics`
        console.log('打印查询语句')
        console.log(sql)
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    //根据id查询话题信息
    findById: function (id, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = `select id,title,abstract,topic,type,heat,agree,comment,follow,brower,userid,topiccover,createtime,updatetime from topics where id=${id}`
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
     //根据id查询话题信息
     findByUserId: function (userid, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = "select id,title,abstract,topic,heat,agree,comment,follow,brower,userid,topiccover,createtime,updatetime from topics where userid='"+userid+"'"
        var connection = mysql.createConnection(data);
        console.log("根据用户id查询")
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    //新增话题信息
    insert: function (sys, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        // let sql = `insert into topics(title,detail,createtime,author) values`
        let sql = "insert into sys_type(type,createtime,userid) values('" + sys.type + "','" + sys.createtime + "','" + sys.userid  + "')"
        console.log("打印操作结果")
        console.log(sql)
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    // 删除话题信息
    deleteById: function (id, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = `delete from topics where id=${id}`
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    // 修改话题信息
    updateById: function (topic, id, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = "update topics set title='" + topic.title + "',abstract=" + "'" + topic.abstract + "',topic=" + "'" + topic.topic + "',heat=" + "'" + topic.heat+ "',type=" + "'" + topic.type + "',agree=" + "'" + topic.agree + "',comment=" + "'" + topic.comment + "',follow=" + "'" + topic.follow + "',brower=" + "'" + topic.brower + "',userid=" + "'" + topic.userid + "',topiccover=" + "'" + topic.topiccover + "',updatetime=" + "'" + topic.updatetime + "' where id =" + id
        console.log("修改话题")
        console.log(sql)
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    // 收藏话题
    // data:{
    //topicid:1,
    // userid: 1,
    //}
    followTopic: function (obj, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = "insert into topicfollow(topicid,userid) values('" + obj.topicid + "','" + obj.userid + "')"
        console.log("关注话题")
        console.log(sql)
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                console.log(err)
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    // 赞同话题
    agreeTopic: function (obj, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        let sql = "insert into answeragree(topicid,userid) values('" + obj.topicid + "','" + obj.userid + "')"
        console.log("赞同话题")
        console.log(sql)
        var connection = mysql.createConnection(data);
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            //开始数据操作
            connection.query(sql, params, function (err, results, fields) {
                if (err) {
                    console.log('数据操作失败');
                    throw err;
                }
                //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
                callback && callback(results, fields);
                //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                connection.end(function (err) {
                    if (err) {
                        console.log('关闭数据库连接失败！');
                        throw err;
                    }
                });
            });
        });
    },
    //根据话题id数组循环获取话题信息
    findsByTopicid: function (list, params, callback) {
        //每次使用的时候需要创建链接，数据操作完成之后要关闭连接
        var connection = mysql.createConnection(data);
        let userlist = []
        connection.connect(function (err) {
            if (err) {
                console.log('数据库链接失败');
                throw err;
            }
            for (let i = 0; i < list.length; i++) {
                let sql = "select id,title,abstract,type,topic,heat,agree,comment,follow,brower,userid,topiccover,createtime,updatetime from topics where id=" + "'" + list[i].topicid + "'"
                //开始数据操作
                console.log(sql)
                connection.query(sql, params, function (err, results, fields) {
                    if (err) {
                        console.log('数据操作失败');
                        throw err;
                    }
                    //results作为数据操作后的结果，fields作为数据库连接的一些字段，大家可以打印到控制台观察一下
                    //停止链接数据库，必须再查询语句后，要不然一调用这个方法，就直接停止链接，数据操作就会失败
                    userlist.push(results[0])
                    console.log("打印回调函数")
                    console.log(userlist)
                    if(i==list.length-1){
                        callback && callback(userlist);
                    }
                });
            }
         
            //将查询出来的数据返回给回调函数，这个时候就没有必要使用错误前置的思想了，因为我们在这个文件中已经对错误进行了处理，如果数据检索报错，直接就会阻塞到这个文件中
            connection.end(function (err) {
                if (err) {
                    console.log('关闭数据库连接失败！');
                    throw err;
                }
            });
        });
    },
};
