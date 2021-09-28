package com.obot.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obot.models.Node;

public interface NodeRepo extends JpaRepository<Node, String>{

}
