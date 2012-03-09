class FriendshipsController < ApplicationController
  def index
    user = User.find(params[:user_id])
    user.friends_count = user.friends_count + 1
    friend = User.find(:first, :conditions => ['id = ?', params[:friend_id]])
    friend.follower_count = friend.follower_count + 1
    @friendship = current_user.friendships.build(:friend_id => params[:friend_id])
    if @friendship.save and user.save and friend.save
      flash[:notice] = "Friend Added."
      redirect_to root_url
    else
      flash[:error] = "Could not add friend."
      redirect_to root_url
    end
  end

  def destroy
    @friendship = current_user.friendships.find(params[:id])
    @friendship.destroy
    flash[:notice] = "Succesfuly destroyed friendship."
    redirect_to root_url
  end

  def show
    @friendships = Friendship.where("user_id = id")
    respond_to do |format|
      format.html
    end
  end

end
