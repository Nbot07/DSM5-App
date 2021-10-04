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

        ResultSet rs=statement.executeQuery("select id from Node");
        int max = 0;
        String id = "";
        while(rs.next()) {
        	id=rs.getString(1);
        	int idNum = Integer.valueOf(id.substring(1));
        	if (idNum > max)
        		max = idNum;
        }
        //int idNum = id != "" ? Integer.valueOf(id.substring(1)) + 1: 1;
        String generatedId = prefix + new Integer(max + 1).toString();
        System.out.println("The id = "+ generatedId);
        return generatedId;
//        if(rs.next())
//        {
//            int id=rs.getInt(1)+101;
//            System.out.println("The id = "+id);
//            String generatedId = prefix + new Integer(id).toString();
//            return generatedId;
//        }
    } catch (SQLException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
    }

    return null;
}

}
