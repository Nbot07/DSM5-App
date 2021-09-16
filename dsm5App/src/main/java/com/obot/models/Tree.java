package com.obot.models;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Tree {
	
	@Id
	String name;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "node_id", referencedColumnName = "id")
	Node root;
	
}
