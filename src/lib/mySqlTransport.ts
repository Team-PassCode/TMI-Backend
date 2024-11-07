/**
 * This is a MySQL transport module for winston.
 * https://github.com/winstonjs/winston
 * Notice: User should create a log table in MySQL first,
 * the default table fields are 'level', 'meta', 'message', 'timestamp'. But you can
 * use your custom table fields by setting: options.fields.
 * Example: options.fields = { level: 'mylevel', meta: 'metadata', message: 'source', timestamp: 'addDate'}
 * Two demo tables:
 *
 CREATE TABLE `WinstonTest`.`sys_logs_default` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(2048) NOT NULL,
 `meta` VARCHAR(2048) NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 *
 CREATE TABLE `WinstonTest`.`sys_logs_custom` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `mylevel` VARCHAR(16) NOT NULL,
 `source` VARCHAR(1024) NOT NULL,
 `metadata` VARCHAR(2048) NOT NULL,
 `addDate` DATETIME NOT NULL,
 PRIMARY KEY (`id`));
 *
 CREATE TABLE `WinstonTest`.`sys_logs_json` (
 `id` INT NOT NULL AUTO_INCREMENT,
 `level` VARCHAR(16) NOT NULL,
 `message` VARCHAR(2048) NOT NULL,
 `meta` JSON NOT NULL,
 `timestamp` DATETIME NOT NULL,
 PRIMARY KEY (`id`));

 */

 import Transport, { TransportStreamOptions } from "winston-transport";
 import {
   Pool,
   PoolConnection,
   PoolOptions,
   createPool,
 } from "mysql2";
 
 /**
  * @constructor
  * @param {Object} options      Options for the MySQL & log plugin
  * @param {String} options.host Database host
  * @param {String} options.user Database username
  * @param {String} options.password Database password
  * @param {String} options.database Database name
  * @param {String} options.table  Database table for the logs
  * @param {Object} **Optional** options.fields Log object, set custom fields for the log table
  */
 
 interface MySQLTransportOptions extends TransportStreamOptions {
     host:string,
     user:string,
     password:string,
     database:string,
     table:string
 }
 
 interface LogEntry {
   method_name: string;
   error_message: string;
   outgoing: boolean;
   stack_trace?: string;
   input_params?: Record<string, unknown>;
   route?: string;
   created_by?: string;
 }
 
 export default class MySQLTransport extends Transport {
   name: string;
   options: MySQLTransportOptions;
   pool: Pool;
 
   constructor(options: MySQLTransportOptions) {
     super(options);
 
     this.name = "MySQL";
 
     //Please visit https://github.com/felixge/node-mysql#connection-options to get default options for mysql module
     this.options = options || {};
     
     // check parameters
     if (
       !options.host ||
       !options.user ||
       !options.password ||
       !options.database ||
       !options.table
     ) {
       throw new Error(
         "All database connection fields (host, user, password, database, table) are required"
       );
     }
 
     const connOpts = {
       host: options.host,
       user: options.user,
       password: options.password,
       database: options.database,
     };
 
     this.pool = createPool(connOpts);
   }
 
   /**
    * function log (info, callback)
    * {level, msg, [meta]} = info
    * @level {string} Level at which to log the message.
    * @msg {string} Message to log
    * @meta {Object} **Optional** Additional metadata to attach
    * @callback {function} Continuation to respond to when complete.
    * Core logging method exposed to Winston. Metadata is optional.
    */
 
   log(info: any, callback: Function) {
     // get log content
     const {
       method_name,
       route,
       input_params,
       error_message,
       stack_trace,
       userid,
     } = info;
 
     process.nextTick(() => {
       this.pool.getConnection(
         (err: Error | null, connection: PoolConnection) => {
           if (err) {
             return callback(err, null);
           }
 
           // Construct log object
           const log = {
             method_name,
             route: route || null,
             input_params: JSON.stringify(input_params || {}),
             error_message,
             stack_trace: stack_trace || null,
             userid: userid || null,
           };
 
           // Insert log into the database
           connection.query(
             `INSERT INTO ${this.options.table} SET ?`,
             log,
             (err, results) => {
               connection.release();
               if (err) {
                 this.emit("error", err);
                 return callback(err, null);
               }
 
               this.emit("logged", info);
               callback(null, true);
             }
           );
         }
       );
     });
   }
 };
 