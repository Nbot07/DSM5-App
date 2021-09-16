package com.obot.repos;

import org.springframework.data.jpa.repository.JpaRepository;

import com.obot.models.Tree;

public interface TreeRepo extends JpaRepository<Tree, String> {

}
