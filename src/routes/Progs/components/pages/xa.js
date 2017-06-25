import React, {Component} from 'react'

export default props => (
  <div>
    <h2>MySQL XA Transactions on Yii2 Active Record</h2>
    <h3>The Problem</h3>
    <p>
      At my job, we have <em>lots</em> of MySQL connection instances floating around.
      A common problem has been wrapping operations on different connections into a single transactional unit.
    </p>
    <h3>The Solution</h3>
    <p>
      One of my colleagues stumbled across
      the <a href="https://dev.mysql.com/doc/refman/5.6/en/xa.html">manual page</a> for MySQL XA transactions. Using XA
      transactions, we can do
      a <a href="https://en.wikipedia.org/wiki/Two-phase_commit_protocol">two phase commit</a> so that operations across
      connections will all succeed or all fail.
    </p>
    <h3>The Prog</h3>
    <p>
      I wrote a <a href="https://github.com/arleighdickerson/yii2-xa-transactions">Yii2 extension</a> that ties XA
      Transactions into the framework's ORM.
    </p>
  </div>
)


