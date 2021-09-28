package com.obot.models;

import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;

import org.hibernate.annotations.GenericGenerator;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Node {
	
	@Id
	//@GeneratedValue(strategy = GenerationType.AUTO)
	@JsonProperty(access = JsonProperty.Access.READ_ONLY)
	//@ManyToOne(targetEntity = "node_children")
	@GenericGenerator(name = "node_id", strategy = "com.obot.generators.NodeIdGenerator")
    @GeneratedValue(generator = "node_id") 
	String id;
	
	String name;
	String title;
	@OneToMany()
	//@ManyToMany(cascade = CascadeType.ALL)
	//@JoinTable(name = "node", joinColumns = @JoinColumn(name = "node_id"), inverseJoinColumns = @JoinColumn(name = "id"))
	//@Cascade({CascadeType.ALL})
	//@OnDelete(action = OnDeleteAction.CASCADE)
	@JoinColumn(name = "node_id")
	List<Node> children;
//	String description;
//	@OneToMany(mappedBy="parent")
//	List<Edge> answers;
	
//	@OneToOne(cascade = CascadeType.ALL)
//    @JoinColumn(name = "edge_id", referencedColumnName = "id")
//	Edge parent;
}
