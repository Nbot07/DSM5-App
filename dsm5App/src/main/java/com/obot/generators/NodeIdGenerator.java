package com.obot.generators;

import java.io.Serializable;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

import org.hibernate.HibernateException;
import org.hibernate.engine.spi.SessionImplementor;
import org.hibernate.engine.spi.SharedSessionContractImplementor;
import org.hibernate.id.IdentifierGenerator;

public class NodeIdGenerator implements IdentifierGenerator {

@Override
public Serializable generate(SharedSessionContractImplementor session, Object object)
        throws HibernateException {

    String prefix = "n";
    Connection connection = session.connection();

    try {
        Statement statement=connection.createStatement();

        ResultSet rs=statement.executeQuery("select count(id) as Id from Node");

        if(rs.next())
        {
            int id=rs.getInt(1)+101;
            System.out.println("The id = "+id);
            String generatedId = prefix + new Integer(id).toString();
            return generatedId;
        }
    } catch (SQLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }

    return null;
}

}
