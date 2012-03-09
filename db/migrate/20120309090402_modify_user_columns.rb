class ModifyUserColumns < ActiveRecord::Migration
  def change
=begin
  	remove_column :users, :first_name
  	remove_column :users, :last_name
  	remove_column :users, :location
  	remove_column :users, :friends_count
=end
  	remove_column :users, :follower_count 
  	remove_column :users, :status_count
  	remove_column :users, :protected

  	add_column :users, :first_name, :string
  	add_column :users, :last_name, :string
  	add_column :users, :location, :text
  	add_column :users, :friends_count, :integer, :default => 0
  	add_column :users, :follower_count, :integer, :default => 0
  	add_column :users, :status_count, :integer, :default => 0
  	add_column :users, :protected, :boolean, :default => false

  end
end
