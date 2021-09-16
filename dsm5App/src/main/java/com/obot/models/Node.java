package com.obot.models;

import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

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
	@GeneratedValue(strategy = GenerationType.AUTO)
	int id;
	
	String description;
	@OneToMany(mappedBy="parent")
	List<Edge> answers;
	
	@OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "edge_id", referencedColumnName = "id")
	Edge parent;
}
